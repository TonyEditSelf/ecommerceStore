require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const { categories, makeSeedProducts } = require("./data/seed-products.cjs");

const allowedFlagKeys = ["featured", "latest", "bestSelling", "fastSelling"];

function cleanFlags(flags = {}) {
  return allowedFlagKeys.reduce((next, key) => {
    next[key] = Boolean(flags[key]);
    return next;
  }, {});
}

function changedFlags(current = {}, next = {}) {
  return JSON.stringify(current || {}) !== JSON.stringify(cleanFlags(next));
}

async function syncProducts() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase credentials are required");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const seedProducts = makeSeedProducts();
  const productsByCategory = new Map();
  for (const product of seedProducts) {
    if (!productsByCategory.has(product.category)) productsByCategory.set(product.category, []);
    productsByCategory.get(product.category).push(product);
  }

  let inserted = 0;
  let updated = 0;
  let deleted = 0;

  for (const [, category] of categories) {
    const desiredProducts = productsByCategory.get(category) || [];
    const { data: existingProducts, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("category", category)
      .order("id", { ascending: true });

    if (fetchError) throw fetchError;

    for (let index = 0; index < desiredProducts.length; index += 1) {
      const payload = { ...desiredProducts[index], flags: cleanFlags(desiredProducts[index].flags) };
      const existing = existingProducts?.[index];

      if (existing) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
        updated += 1;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        inserted += 1;
      }
    }

    const extraIds = (existingProducts || []).slice(desiredProducts.length).map((product) => product.id);
    if (extraIds.length) {
      const { error } = await supabase.from("products").delete().in("id", extraIds);
      if (error) throw error;
      deleted += extraIds.length;
    }
  }

  const { data: allProducts, error: allError } = await supabase
    .from("products")
    .select("id, flags");
  if (allError) throw allError;

  let normalized = 0;
  for (const product of allProducts || []) {
    if (!changedFlags(product.flags, product.flags)) continue;
    const { error } = await supabase
      .from("products")
      .update({ flags: cleanFlags(product.flags) })
      .eq("id", product.id);
    if (error) throw error;
    normalized += 1;
  }

  console.log(`Product sync complete: ${inserted} inserted, ${updated} updated, ${deleted} deleted, ${normalized} normalized.`);
}

syncProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});

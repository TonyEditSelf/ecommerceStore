require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

async function testCreate() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const testProduct = {
    title: "Test Product " + Date.now(),
    slug: "test-product-" + Date.now(),
    description: "This is a test product created by the diagnostic script.",
    price: 999,
    category: "projectors",
    media: [{ url: "https://placehold.co/600", publicId: "test", type: "image" }],
    rating: 5,
    stock: 10,
    flags: { featured: true }
  };

  console.log("Attempting to insert product...");
  const { data, error } = await supabase
    .from("products")
    .insert([testProduct])
    .select();

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Insert success:", data);
  }

  console.log("Attempting to fetch recent products...");
  const { data: products, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (fetchError) {
    console.error("Fetch error:", fetchError);
  } else {
    console.log("Recent products:", products.map(p => ({ id: p.id, title: p.title, created_at: p.created_at })));
  }
}

testCreate();

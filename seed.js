const fs = require("fs");
fs.appendFileSync("seed-execution.log", `Seed triggered at ${new Date().toISOString()}\n`);
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const { makeSeedProducts } = require("./data/seed-products.cjs");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const categories = [
  ["Projectors", "projectors"],
  ["Portable Projectors", "portable-projectors"],
  ["Projector Screens", "projector-screens"],
  ["Projector Accessories", "projector-accessories"],
  ["AR Glasses", "ar-glasses"],
  ["Robotic Vacuum Cleaners", "robotic-vacuum-cleaners"],
  ["Smart Watches", "smart-watches"],
  ["E-Scooters", "e-scooters"],
  ["Mobile Phones", "mobile-phones"],
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const categoryImages = {
  "projectors": "https://images.unsplash.com/photo-1517604401107-5b8c9f9000cd?auto=format&fit=crop&q=80&w=1200",
  "portable-projectors": "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=1200",
  "projector-screens": "https://images.unsplash.com/photo-1471617466752-64687d609230?auto=format&fit=crop&q=80&w=1200",
  "projector-accessories": "https://images.unsplash.com/photo-1591488321443-e31464689408?auto=format&fit=crop&q=80&w=1200",
  "ar-glasses": "https://images.unsplash.com/photo-1481277542470-605fe9aef25c?auto=format&fit=crop&q=80&w=1200",
  "robotic-vacuum-cleaners": "https://images.unsplash.com/photo-1631553127989-13c54575824c?auto=format&fit=crop&q=80&w=1200",
  "smart-watches": "https://images.unsplash.com/photo-1523275335664-4d5ba3542911?auto=format&fit=crop&q=80&w=1200",
  "e-scooters": "https://images.unsplash.com/photo-1594736797933-d0501ba2fe35?auto=format&fit=crop&q=80&w=1200",
  "mobile-phones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
};

function productImage(title, category, index) {
  const url = categoryImages[category] || `https://images.unsplash.com/photo-1550009158-97e8d01c60b7?auto=format&fit=crop&q=80&w=1200`;
  return {
    url,
    publicId: `seed/${slugify(title)}`,
    type: "image",
    alt: title,
  };
}

function makeProducts() {
  return makeSeedProducts();
}

async function seed() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase credentials are required");
  }

  // Clear existing data
  await supabase.from("products").delete().neq("id", -1);
  await supabase.from("hero_content").delete().neq("id", -1);
  await supabase.from("testimonials").delete().neq("id", -1);

  // Insert products
  const productsData = makeProducts();
  const { data: insertedProducts, error: productError } = await supabase
    .from("products")
    .insert(productsData)
    .select();

  if (productError) {
    throw new Error(`Failed to insert products: ${productError.message}`);
  }

  // Insert hero content
  const { error: heroError } = await supabase
    .from("hero_content")
    .insert([
      {
        title: "Bring Every Detail to Life",
        subtitle: "Premium projectors and refined electronics for modern spaces.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
            publicId: "seed/hero-1",
            alt: "Projector hero",
          },
        ],
        active: true,
        sort_order: 1,
      },
      {
        title: "See Beyond Imagination",
        subtitle:
          "Ecommerce Store curates technology with warmth and clarity.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1550009158-97e8d01c60b7?auto=format&fit=crop&q=80&w=1200",
            publicId: "seed/hero-2",
            alt: "AR hero",
          },
        ],
        active: true,
        sort_order: 2,
      },
      {
        title: "Smart Living, Refined",
        subtitle: "Experience the harmony of design and function in every device.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
            publicId: "seed/hero-3",
            alt: "Smart home hero",
          },
        ],
        active: true,
        sort_order: 3,
      },
    ]);

  if (heroError) {
    throw new Error(`Failed to insert hero content: ${heroError.message}`);
  }

  // Insert testimonials
  const { error: testimonialError } = await supabase
    .from("testimonials")
    .insert([
      {
        name: "Arjun Mehta",
        text: "The store feels premium, fast, and easy to browse.",
        rating: 5,
        active: true,
      },
      {
        name: "Neha Sharma",
        text: "Beautiful product pages and a clean buying flow.",
        rating: 5,
        active: true,
      },
      {
        name: "Rohit Verma",
        text: "The admin system is simple enough for daily catalog work.",
        rating: 4.8,
        active: true,
      },
    ]);

  if (testimonialError) {
    throw new Error(`Failed to insert testimonials: ${testimonialError.message}`);
  }

  // Upsert admin user
  const adminEmail = "tony.elsas@gmail.com";
  const hashedPassword = await bcrypt.hash("Jumpstart1!!", 12);

  // First try to update
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("email", adminEmail)
    .single();

  if (existingUser) {
    // Update existing user
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: "Ecommerce Admin",
        password: hashedPassword,
        role: "admin",
      })
      .eq("email", adminEmail);

    if (updateError) {
      throw new Error(`Failed to update admin user: ${updateError.message}`);
    }
  } else {
    // Create new user
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name: "Ecommerce Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        },
      ]);

    if (insertError) {
      throw new Error(`Failed to create admin user: ${insertError.message}`);
    }
  }

  console.log("Seed complete");
  console.log(`Products: ${insertedProducts.length}`);
  console.log(`Admin: ${adminEmail} / Jumpstart1!!`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

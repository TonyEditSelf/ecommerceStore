require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log("Checking 'users' table...");
  const { data, error } = await supabase.from("users").select("*").limit(1);
  if (error) {
    console.error("Error fetching from 'users':", error);
  } else {
    console.log("Success! Found users:", data.length);
    if (data.length > 0) {
      console.log("Sample user keys:", Object.keys(data[0]));
    }
  }

  console.log("\nTesting user insertion...");
  const testEmail = `test_${Date.now()}@example.com`;
  const { data: iData, error: iError } = await supabase.from("users").insert([{
    name: "Test User",
    email: testEmail,
    password: "testpassword",
    role: "customer"
  }]).select();

  if (iError) {
    console.error("Error inserting user:", iError);
  } else {
    console.log("Success! Inserted user:", iData);
    if (iData && iData.length > 0) {
      // Clean up
      await supabase.from("users").delete().eq("email", testEmail);
      console.log("Cleaned up test user.");
    } else {
      console.warn("WARNING: Insert succeeded but returned NO DATA. This usually means RLS is enabled without a proper policy.");
    }
  }

  console.log("\nChecking 'products' table...");
  const { data: pData, error: pError } = await supabase.from("products").select("*").limit(1);
  if (pError) {
    console.error("Error fetching from 'products':", pError);
  } else {
    console.log("Success! Found products:", pData.length);
  }

  console.log("\nChecking 'orders' table...");
  const { data: oData, error: oError } = await supabase.from("orders").select("*").limit(1);
  if (oError) {
    console.error("Error fetching from 'orders':", oError);
  } else {
    console.log("Success! Found orders:", oData.length);
    if (oData.length > 0) {
      console.log("Sample order keys:", Object.keys(oData[0]));
    }
  }
}

test();

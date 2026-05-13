require("dotenv").config({ path: ".env.local" });
const { connectDB } = require("./lib/db");
const { signToken, verifyToken } = require("./lib/auth");
const { createClient } = require("@supabase/supabase-js");

async function testAuth() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // Get the admin user from DB directly
    const { data: user, error: dbErr } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", "admin@ecommercestore.com")
      .single();

    if (dbErr) {
      console.error("DB Error:", dbErr);
      return;
    }

    console.log("User from DB:", user);

    // Sign the token exactly as login route does
    const token = signToken(user);
    console.log("Signed Token:", token);

    // Verify token
    const payload = verifyToken(token);
    console.log("Verified Payload:", payload);

    // Now mimic getCurrentUser DB lookup
    const { data: fetchedUser, error: fetchErr } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, created_at, updated_at")
      .eq("id", payload.sub)
      .single();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      console.error("Fetch Error:", fetchErr);
      return;
    }

    console.log("Fetched User by Payload Sub:", fetchedUser);

  } catch (e) {
    console.error("Caught Exception:", e);
  }
}

testAuth();

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function monitor() {
  console.log("Monitoring products... (Ctrl+C to stop)");
  for (let i = 0; i < 20; i++) {
    const { data, count, error } = await supabase
      .from("products")
      .select("id, title, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (error) console.error("Error:", error);
    else {
      console.log(`\n${new Date().toISOString()} - Total products: ${count}`);
      data.forEach(p => console.log(`  [${p.id}] ${p.title} (${p.created_at})`));
    }
    
    await new Promise(r => setTimeout(r, 5000));
  }
}

monitor();

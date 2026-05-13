require("dotenv").config({ path: ".env.local" });
const { connectDB } = require("./lib/db");
// We need to mock the path alias or just require directly
const Product = require("./models/Product").default;

async function testModel() {
  await connectDB();
  console.log("Calling Product.find({}, { sort: { createdAt: -1 }, limit: 100 })...");
  try {
    const products = await Product.find({}, { sort: { createdAt: -1 }, limit: 100 });
    console.log(`Found ${products.length} products.`);
    if (products.length > 0) {
      console.log("First product sample:", {
        id: products[0].id,
        _id: products[0]._id,
        title: products[0].title,
        created_at: products[0].created_at
      });
    }
    
    const count = await Product.countDocuments({});
    console.log(`Total products count: ${count}`);
    
  } catch (err) {
    console.error("Error in Product.find:", err);
  }
}

testModel();

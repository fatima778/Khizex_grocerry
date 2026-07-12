import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Product } from "../models/Product";

dotenv.config();

interface SeedProduct {
  name: string;
  description: string;
  price: number;
  unit: "kg" | "lb" | "pack" | "each";
  category: string;
  stock: number;
  lowStockThreshold: number;
}

const PRODUCTS: SeedProduct[] = [
  // Fruits & Vegetables (15)
  { name: "Fresh Bananas", description: "Sweet ripe bananas, perfect for snacking", price: 1.99, unit: "kg", category: "Fruits & Vegetables", stock: 60, lowStockThreshold: 10, images: ["https://images.pexels.com/photos/4114131/pexels-photo-4114131.jpeg?auto=compress&cs=tinysrgb&w=600"] },
  { name: "Roma Tomatoes", description: "Juicy vine-ripened tomatoes", price: 2.49, unit: "kg", category: "Fruits & Vegetables", stock: 45, lowStockThreshold: 10, images: ["https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600"] },
  { name: "Baby Spinach", description: "Tender washed spinach leaves", price: 1.79, unit: "pack", category: "Fruits & Vegetables", stock: 30, lowStockThreshold: 8 },
  { name: "Avocados", description: "Creamy Hass avocados, ready to eat", price: 3.29, unit: "pack", category: "Fruits & Vegetables", stock: 25, lowStockThreshold: 8 },
  { name: "Red Bell Peppers", description: "Crisp, sweet red peppers", price: 2.99, unit: "kg", category: "Fruits & Vegetables", stock: 35, lowStockThreshold: 8 },
  { name: "Green Grapes", description: "Seedless sweet green grapes", price: 2.89, unit: "kg", category: "Fruits & Vegetables", stock: 30, lowStockThreshold: 8 },
  { name: "Carrots", description: "Crunchy garden-fresh carrots", price: 1.49, unit: "kg", category: "Fruits & Vegetables", stock: 50, lowStockThreshold: 10 },
  { name: "Red Apples", description: "Crisp and juicy red apples", price: 2.59, unit: "kg", category: "Fruits & Vegetables", stock: 55, lowStockThreshold: 10, images: ["https://images.pexels.com/photos/7333127/pexels-photo-7333127.jpeg?auto=compress&cs=tinysrgb&w=600"] },
  { name: "Cucumbers", description: "Cool, crisp cucumbers", price: 1.29, unit: "kg", category: "Fruits & Vegetables", stock: 40, lowStockThreshold: 8 },
  { name: "Oranges", description: "Juicy seedless oranges", price: 2.19, unit: "kg", category: "Fruits & Vegetables", stock: 42, lowStockThreshold: 8 },
  { name: "Green Cabbage", description: "Fresh crisp green cabbage head", price: 1.59, unit: "each", category: "Fruits & Vegetables", stock: 28, lowStockThreshold: 6 },
  { name: "White Onions", description: "Firm, flavourful white onions", price: 1.39, unit: "kg", category: "Fruits & Vegetables", stock: 48, lowStockThreshold: 10 },
  { name: "Garlic Bulbs", description: "Aromatic fresh garlic bulbs", price: 0.99, unit: "pack", category: "Fruits & Vegetables", stock: 60, lowStockThreshold: 12 },
  { name: "Lemons", description: "Zesty fresh lemons", price: 1.89, unit: "kg", category: "Fruits & Vegetables", stock: 33, lowStockThreshold: 8 },
  { name: "Green Broccoli", description: "Fresh crisp broccoli crowns", price: 2.29, unit: "kg", category: "Fruits & Vegetables", stock: 26, lowStockThreshold: 6 },

  // Dairy (15)
  { name: "Whole Milk", description: "Farm-fresh pasteurized whole milk", price: 2.29, unit: "each", category: "Dairy", stock: 50, lowStockThreshold: 10 },
  { name: "Greek Yogurt", description: "Thick and creamy natural yogurt", price: 3.49, unit: "pack", category: "Dairy", stock: 40, lowStockThreshold: 10 },
  { name: "Cheddar Cheese", description: "Aged sharp cheddar block", price: 4.99, unit: "pack", category: "Dairy", stock: 22, lowStockThreshold: 6 },
  { name: "Free-Range Eggs", description: "Dozen free-range eggs", price: 3.99, unit: "pack", category: "Dairy", stock: 38, lowStockThreshold: 10 },
  { name: "Butter", description: "Creamy salted butter block", price: 3.29, unit: "each", category: "Dairy", stock: 26, lowStockThreshold: 6 },
  { name: "Mozzarella", description: "Soft fresh mozzarella cheese", price: 4.49, unit: "pack", category: "Dairy", stock: 18, lowStockThreshold: 5 },
  { name: "Skimmed Milk", description: "Low-fat pasteurized skimmed milk", price: 2.19, unit: "each", category: "Dairy", stock: 34, lowStockThreshold: 8 },
  { name: "Cream Cheese", description: "Smooth spreadable cream cheese", price: 3.79, unit: "pack", category: "Dairy", stock: 20, lowStockThreshold: 5 },
  { name: "Sour Cream", description: "Rich and tangy sour cream", price: 2.69, unit: "pack", category: "Dairy", stock: 24, lowStockThreshold: 6 },
  { name: "Parmesan Cheese", description: "Aged grated parmesan cheese", price: 5.49, unit: "pack", category: "Dairy", stock: 16, lowStockThreshold: 5 },
  { name: "Whipping Cream", description: "Fresh dairy whipping cream", price: 3.19, unit: "each", category: "Dairy", stock: 22, lowStockThreshold: 5 },
  { name: "Flavoured Yogurt", description: "Strawberry flavoured yogurt cups, pack of 4", price: 4.19, unit: "pack", category: "Dairy", stock: 28, lowStockThreshold: 6 },
  { name: "Cottage Cheese", description: "Soft and fresh cottage cheese", price: 3.59, unit: "pack", category: "Dairy", stock: 19, lowStockThreshold: 5 },
  { name: "Almond Milk", description: "Dairy-free almond milk", price: 3.29, unit: "each", category: "Dairy", stock: 25, lowStockThreshold: 6 },
  { name: "Brie Cheese", description: "Soft ripened brie wheel", price: 6.49, unit: "pack", category: "Dairy", stock: 12, lowStockThreshold: 4 },

  // Bakery (15)
  { name: "Sourdough Loaf", description: "Freshly baked sourdough bread", price: 3.79, unit: "each", category: "Bakery", stock: 20, lowStockThreshold: 6 },
  { name: "Croissants", description: "Buttery, flaky croissants, pack of 4", price: 4.49, unit: "pack", category: "Bakery", stock: 18, lowStockThreshold: 5 },
  { name: "Whole Wheat Bread", description: "Soft wholegrain sandwich bread", price: 2.99, unit: "each", category: "Bakery", stock: 32, lowStockThreshold: 8 },
  { name: "Bagels", description: "Classic New York style bagels, pack of 6", price: 3.99, unit: "pack", category: "Bakery", stock: 24, lowStockThreshold: 6 },
  { name: "Chocolate Muffins", description: "Rich double chocolate muffins, pack of 4", price: 4.29, unit: "pack", category: "Bakery", stock: 16, lowStockThreshold: 5 },
  { name: "Dinner Rolls", description: "Soft dinner rolls, pack of 8", price: 3.49, unit: "pack", category: "Bakery", stock: 22, lowStockThreshold: 6 },
  { name: "Baguette", description: "Crusty French baguette", price: 2.79, unit: "each", category: "Bakery", stock: 18, lowStockThreshold: 5 },
  { name: "Cinnamon Rolls", description: "Glazed cinnamon rolls, pack of 4", price: 4.79, unit: "pack", category: "Bakery", stock: 14, lowStockThreshold: 4 },
  { name: "Rye Bread", description: "Hearty dark rye bread loaf", price: 3.29, unit: "each", category: "Bakery", stock: 15, lowStockThreshold: 4 },
  { name: "Blueberry Muffins", description: "Fresh blueberry muffins, pack of 4", price: 4.39, unit: "pack", category: "Bakery", stock: 17, lowStockThreshold: 5 },
  { name: "Pita Bread", description: "Soft pocket pita bread, pack of 6", price: 2.49, unit: "pack", category: "Bakery", stock: 26, lowStockThreshold: 6 },
  { name: "Pretzels", description: "Soft salted pretzels, pack of 4", price: 3.99, unit: "pack", category: "Bakery", stock: 13, lowStockThreshold: 4 },
  { name: "Donuts", description: "Glazed ring donuts, pack of 6", price: 4.99, unit: "pack", category: "Bakery", stock: 12, lowStockThreshold: 4 },
  { name: "Multigrain Bread", description: "Seeded multigrain sandwich loaf", price: 3.49, unit: "each", category: "Bakery", stock: 20, lowStockThreshold: 5 },
  { name: "Naan Bread", description: "Soft tandoor-style naan, pack of 4", price: 3.19, unit: "pack", category: "Bakery", stock: 21, lowStockThreshold: 5 },

  // Beverages (15)
  { name: "Orange Juice", description: "100% fresh squeezed orange juice", price: 3.99, unit: "each", category: "Beverages", stock: 28, lowStockThreshold: 8 },
  { name: "Sparkling Water", description: "Naturally carbonated spring water, 6-pack", price: 4.29, unit: "pack", category: "Beverages", stock: 26, lowStockThreshold: 8 },
  { name: "Green Tea Bags", description: "Premium loose-leaf green tea, 25 bags", price: 3.49, unit: "pack", category: "Beverages", stock: 24, lowStockThreshold: 6 },
  { name: "Cola Bottles", description: "Classic cola, pack of 6", price: 5.49, unit: "pack", category: "Beverages", stock: 30, lowStockThreshold: 8 },
  { name: "Coffee Beans", description: "Medium roast whole coffee beans", price: 8.99, unit: "pack", category: "Beverages", stock: 20, lowStockThreshold: 5 },
  { name: "Apple Juice", description: "100% pure apple juice", price: 3.79, unit: "each", category: "Beverages", stock: 24, lowStockThreshold: 6 },
  { name: "Mineral Water", description: "Still natural mineral water, 6-pack", price: 3.29, unit: "pack", category: "Beverages", stock: 40, lowStockThreshold: 10 },
  { name: "Black Tea Bags", description: "Classic black tea, 50 bags", price: 3.99, unit: "pack", category: "Beverages", stock: 22, lowStockThreshold: 6 },
  { name: "Instant Coffee", description: "Rich instant coffee granules", price: 6.49, unit: "each", category: "Beverages", stock: 18, lowStockThreshold: 5 },
  { name: "Lemonade", description: "Fresh squeezed lemonade", price: 3.59, unit: "each", category: "Beverages", stock: 20, lowStockThreshold: 5 },
  { name: "Energy Drink", description: "Sugar-free energy drink, 4-pack", price: 6.99, unit: "pack", category: "Beverages", stock: 16, lowStockThreshold: 5 },
  { name: "Iced Tea", description: "Peach flavoured iced tea", price: 3.49, unit: "each", category: "Beverages", stock: 19, lowStockThreshold: 5 },
  { name: "Coconut Water", description: "100% natural coconut water", price: 4.19, unit: "each", category: "Beverages", stock: 15, lowStockThreshold: 4 },
  { name: "Grape Juice", description: "Sweet concord grape juice", price: 3.89, unit: "each", category: "Beverages", stock: 17, lowStockThreshold: 5 },
  { name: "Hot Chocolate Mix", description: "Rich cocoa hot chocolate mix", price: 5.29, unit: "pack", category: "Beverages", stock: 14, lowStockThreshold: 4 },

  // Household (15)
  { name: "Dish Soap", description: "Grease-cutting dish soap, lemon scent", price: 2.79, unit: "each", category: "Household", stock: 33, lowStockThreshold: 8 },
  { name: "Paper Towels", description: "2-ply absorbent paper towels, 4 rolls", price: 5.49, unit: "pack", category: "Household", stock: 20, lowStockThreshold: 6 },
  { name: "Laundry Detergent", description: "Concentrated liquid detergent, 1.5L", price: 6.99, unit: "each", category: "Household", stock: 16, lowStockThreshold: 5 },
  { name: "Toilet Paper", description: "Soft 2-ply toilet paper, 9 rolls", price: 7.49, unit: "pack", category: "Household", stock: 22, lowStockThreshold: 6 },
  { name: "All-Purpose Cleaner", description: "Multi-surface cleaning spray", price: 3.99, unit: "each", category: "Household", stock: 25, lowStockThreshold: 6 },
  { name: "Trash Bags", description: "Heavy-duty trash bags, 30 count", price: 4.49, unit: "pack", category: "Household", stock: 28, lowStockThreshold: 6 },
  { name: "Glass Cleaner", description: "Streak-free glass cleaner spray", price: 3.29, unit: "each", category: "Household", stock: 18, lowStockThreshold: 5 },
  { name: "Fabric Softener", description: "Fresh scent fabric softener", price: 4.99, unit: "each", category: "Household", stock: 14, lowStockThreshold: 4 },
  { name: "Sponges", description: "Multi-purpose scrub sponges, 6 pack", price: 2.49, unit: "pack", category: "Household", stock: 30, lowStockThreshold: 8 },
  { name: "Air Freshener", description: "Long-lasting room air freshener", price: 3.79, unit: "each", category: "Household", stock: 20, lowStockThreshold: 5 },
  { name: "Hand Soap", description: "Moisturizing liquid hand soap", price: 2.99, unit: "each", category: "Household", stock: 26, lowStockThreshold: 6 },
  { name: "Bleach", description: "Disinfecting bleach cleaner", price: 3.49, unit: "each", category: "Household", stock: 15, lowStockThreshold: 4 },
  { name: "Aluminum Foil", description: "Heavy-duty aluminum foil roll", price: 4.29, unit: "each", category: "Household", stock: 17, lowStockThreshold: 5 },
  { name: "Dishwasher Tablets", description: "Deep clean dishwasher tablets, 20 count", price: 6.49, unit: "pack", category: "Household", stock: 13, lowStockThreshold: 4 },
  { name: "Floor Cleaner", description: "Multi-surface floor cleaner", price: 4.79, unit: "each", category: "Household", stock: 16, lowStockThreshold: 4 },
];

async function seedProducts(): Promise<void> {
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) {
      // Update existing product with latest seed data (e.g. newly added images)
      // but preserve its current live stock so re-running this script never
      // silently resets inventory that customers have already purchased from.
      await Product.updateOne(
        { _id: exists._id },
        { $set: { ...p, stock: exists.stock } }
      );
      updated++;
      continue;
    }
    await Product.create(p);
    created++;
  }

  console.log(`Seeding complete: ${created} products created, ${updated} existing products updated (stock preserved).`);

  await mongoose.disconnect();
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

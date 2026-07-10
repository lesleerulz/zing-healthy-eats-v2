import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

const CATEGORIES = [
  { id: 1, name: "Granola" },
  { id: 2, name: "Trail Mix" },
  { id: 3, name: "Premium" },
];

const PRODUCTS = [
  { id: 1, title: "Signature Honey Almond", description: "Oats baked with pure wild honey, roasted almonds, and a hint of vanilla.", price: 1200, categoryId: 1, image: "/product1.jpg" },
  { id: 2, title: "Tropical Sunrise", description: "A vibrant blend of dried mango, toasted coconut, macadamia nuts, and cashews.", price: 1500, categoryId: 2, image: "/product2.jpg" },
  { id: 3, title: "Dark Choc Hazelnut", description: "Roasted hazelnuts bound together with rich 70% dark chocolate and sea salt.", price: 1800, categoryId: 3, image: "/product3.jpg" },
  { id: 4, title: "Berry Antioxidant Blend", description: "A tangy and sweet mix of goji berries, dried cranberries, walnuts, and pumpkin seeds.", price: 1450, categoryId: 2, image: "/product4.jpg" },
  { id: 5, title: "Maple Pecan Crunch", description: "Autumn flavors packed into crunchy oats with real maple syrup and toasted pecans.", price: 1300, categoryId: 1, image: "/product5.jpg" },
  { id: 6, title: "Spicy Sriracha Cashews", description: "For the bold. Jumbo cashews roasted in our house-made honey sriracha glaze.", price: 1600, categoryId: 3, image: "/product6.jpg" },
  { id: 7, title: "Zesty Lemon & Poppy", description: "Bright and refreshing granola baked with fresh lemon zest and poppy seeds.", price: 1150, categoryId: 1, image: "/product7.jpg" },
  { id: 8, title: "Savoury Rosemary Nuts", description: "A refined mix of walnuts and almonds roasted with fresh rosemary and sea salt.", price: 1700, categoryId: 3, image: "/product8.jpg" },
  { id: 9, title: "Classic Power Mix", description: "The essential trail mix with peanuts, raisins, sunflower seeds, and dark chocolate drops.", price: 950, categoryId: 2, image: "/product9.jpg" },
];

async function main() {
  for (const c of CATEGORIES) {
    await p.category.upsert({ where: { id: c.id }, update: c, create: c });
  }
  for (const prod of PRODUCTS) {
    await p.product.upsert({
      where: { id: prod.id },
      update: { title: prod.title, description: prod.description, price: prod.price, categoryId: prod.categoryId, image: prod.image },
      create: { ...prod, quantity: 100 },
    });
  }
  const [cats, count] = await Promise.all([p.category.count(), p.product.count()]);
  console.log("Seeded. Categories:", cats, "Products:", count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await p.$disconnect();
  });

import { db } from './firebase'; 
import { doc, writeBatch } from "firebase/firestore";

const signaturePizzas = [
  {
    name: "Super",
    desc: "Italian Sausage, Pepperoni, Anchovies, Mushrooms, Onions, Green Peppers, Black Olives",
    price: "$18.49–$36.99",
    imageURL: "/images/pizzas/super.webp",
    order: 1
  },
  {
    name: "Deluxe",
    desc: "Sausage, Pepperoni, Mushrooms, Onions, and Green Peppers.",
    price: "$19.99–$36.99",
    imageURL: "/images/pizzas/Deluxe.webp",
    order: 2
  },
  {
    name: "Carne",
    desc: "Sausage, Pepperoni, Bacon, and Ham.",
    price: "$19.99–$39.99",
    imageURL: "/images/pizzas/carne.jpg",
    order: 3
  },
  {
    name: "Classic Pepperoni",
    desc: "Pepperoni and Mozzarella.",
    price: "$18.49–$38.99",
    imageURL: "/images/pizzas/pepperoni.webp",
    order: 4
  },
  {
    name: "CBR (Chicken, Bacon, Ranch)",
    desc: "Chicken, Bacon, Mozzarella, with ranch drizzle.",
    price: "$19.49–$39.99",
    imageURL: "/images/pizzas/CBR.webp",
    order: 5
  },
  {
    name: "Veggie",
    desc: "Onions, Peppers, Olives, and Mushrooms.",
    price: "$19.49–$39.99",
    imageURL: "/images/pizzas/veggie.webp",
    order: 6
  }
];

export const seedSignaturePizzas = async () => {
  console.log("Seeding Signature Pizzas collection...");
  const batch = writeBatch(db);

  signaturePizzas.forEach((item) => {
    // Generate clean ID: e.g. "deluxe-signature"
    const docId = `${item.name.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-')}-signature`;
    
    // Path: menu -> signature_pizzas -> items -> docId
    const docRef = doc(db, "menu", "signature_pizzas", "items", docId);
    
    batch.set(docRef, {
      ...item,
      available: true,
      lastUpdated: new Date().toISOString(),
    }, { merge: true });
  });

  await batch.commit();
  console.log("Signature Pizzas successfully seeded to menu/signature_pizzas/items");
};
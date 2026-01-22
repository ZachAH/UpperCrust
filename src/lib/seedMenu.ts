import { db } from './firebase';
import { doc, writeBatch } from "firebase/firestore";

const signaturePizzas = [
  {
    name: "BBQ Chicken",
    desc: "Grilled Chicken, Bacon, Onion and Sweet Baby Ray's BBQ Sauce.",
    price: "$19.49 - $39.99",
    imageURL: "",
    order: 18
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
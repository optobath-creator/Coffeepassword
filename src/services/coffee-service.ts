import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  limit, 
  orderBy,
  addDoc,
  serverTimestamp,
  increment,
  runTransaction
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CoffeeShop, WifiPassword, Vote } from "@/types";

const SHOPS_COLLECTION = "coffeeShops";
const PASSWORDS_COLLECTION = "wifiPasswords";
const VOTES_COLLECTION = "votes";

export const coffeeService = {
  // Fetch shops
  async getShops(): Promise<CoffeeShop[]> {
    const shopsCol = collection(db, SHOPS_COLLECTION);
    // Increased limit to show more shops on the map
    const q = query(shopsCol, limit(500));
    const shopSnapshot = await getDocs(q);
    return shopSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CoffeeShop));
  },

  async getShopById(id: string): Promise<CoffeeShop | null> {
    const shopDoc = await getDoc(doc(db, SHOPS_COLLECTION, id));
    return shopDoc.exists() ? ({ id: shopDoc.id, ...shopDoc.data() } as CoffeeShop) : null;
  },

  async getPasswordsForShop(shopId: string): Promise<WifiPassword[]> {
    const passwordsCol = collection(db, PASSWORDS_COLLECTION);
    const q = query(
      passwordsCol, 
      where("shopId", "==", shopId),
      orderBy("confidenceScore", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WifiPassword));
  },

  async submitPassword(shopId: string, password: string, userId: string, ssid?: string): Promise<string> {
    const passwordsCol = collection(db, PASSWORDS_COLLECTION);
    const newPassword = {
      shopId,
      password,
      ssid: ssid || "",
      upvotes: 0,
      downvotes: 0,
      confirmations: 0,
      confidenceScore: 0,
      lastConfirmed: serverTimestamp(),
      submittedBy: userId,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(passwordsCol, newPassword);
    return docRef.id;
  },

  async voteOnPassword(passwordId: string, userId: string, type: Vote["type"]) {
    const voteRef = doc(collection(db, VOTES_COLLECTION));
    
    await runTransaction(db, async (transaction) => {
      const passwordRef = doc(db, PASSWORDS_COLLECTION, passwordId);
      const passwordDoc = await transaction.get(passwordRef);
      
      if (!passwordDoc.exists()) throw new Error("Password does not exist");

      // Record the vote
      transaction.set(voteRef, {
        userId,
        passwordId,
        type,
        createdAt: serverTimestamp(),
      });

      // Update password counts and confidence score
      const updateData: Record<string, unknown> = {};
      if (type === "up") updateData.upvotes = increment(1);
      if (type === "down") updateData.downvotes = increment(1);
      if (type === "confirm") {
        updateData.confirmations = increment(1);
        updateData.lastConfirmed = serverTimestamp();
      }
      
      // Basic confidence score calculation (can be improved)
      const data = passwordDoc.data() as WifiPassword;
      const up = (data.upvotes || 0) + (type === "up" ? 1 : 0);
      const down = (data.downvotes || 0) + (type === "down" ? 1 : 0);
      const conf = (data.confirmations || 0) + (type === "confirm" ? 1 : 0);
      
      updateData.confidenceScore = (up * 2) + (conf * 5) - (down * 3);
      
      transaction.update(passwordRef, updateData);
    });
  }
};

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Report } from "@/types";

const REPORTS_COLLECTION = "reports";

export const moderationService = {
  async reportContent(
    userId: string, 
    targetId: string, 
    targetType: Report["targetType"], 
    reason: string
  ): Promise<string> {
    const newReport = {
      userId,
      targetId,
      targetType,
      reason,
      status: "pending",
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), newReport);
    return docRef.id;
  }
};

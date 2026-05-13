import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Note: In a real environment, you'd import 'bad-words' or a similar library.
// For this example, we use a basic array.
const BAD_WORDS = ["spam", "fake", "badword", "offensive"];

function containsProfanity(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

export const onPasswordSubmitted = functions.firestore
  .document("wifiPasswords/{passwordId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // 1. Profanity & Spam Check
    if (containsProfanity(data.ssid) || containsProfanity(data.comment)) {
      await snap.ref.delete();
      console.log(`Deleted spam password submission: ${context.params.passwordId}`);
      return;
    }

    // 2. Duplicate Check (Simple)
    // Check if the same password was submitted for this shop recently
    const recentSubmissions = await db.collection("wifiPasswords")
      .where("shopId", "==", data.shopId)
      .where("password", "==", data.password)
      .where("createdAt", ">", new Date(Date.now() - 1000 * 60 * 60 * 24)) // Last 24 hours
      .get();

    // The length will be at least 1 (the one we just created)
    if (recentSubmissions.size > 1) {
      await snap.ref.delete();
      console.log(`Deleted duplicate password submission: ${context.params.passwordId}`);
      return;
    }

    // 3. Reward user reputation
    if (data.submittedBy) {
      const userRef = db.collection("users").doc(data.submittedBy);
      await userRef.update({
        reputation: admin.firestore.FieldValue.increment(5)
      });
    }
  });

export const onVoteCast = functions.firestore
  .document("votes/{voteId}")
  .onCreate(async (snap) => {
    const data = snap.data();
    
    // Simple rate limiting: Check if user voted too many times in the last hour
    const recentVotes = await db.collection("votes")
      .where("userId", "==", data.userId)
      .where("createdAt", ">", new Date(Date.now() - 1000 * 60 * 60)) // Last hour
      .get();

    if (recentVotes.size > 50) {
      console.warn(`User ${data.userId} is voting too frequently.`);
      // Optionally ban or flag the user
      // await snap.ref.delete(); 
      // return;
    }

    // Reward user for verifying (confirming) a password
    if (data.type === "confirm") {
      const userRef = db.collection("users").doc(data.userId);
      await userRef.update({
        reputation: admin.firestore.FieldValue.increment(1)
      });
    }
  });

export const processReport = functions.firestore
  .document("reports/{reportId}")
  .onCreate(async (snap) => {
    const data = snap.data();
    
    // Automatically flag passwords with high report counts
    if (data.targetType === "password") {
      const passwordRef = db.collection("wifiPasswords").doc(data.targetId);
      
      const reportCountSnap = await db.collection("reports")
        .where("targetId", "==", data.targetId)
        .where("status", "==", "pending")
        .get();

      if (reportCountSnap.size >= 5) {
        // Automatically hide or delete the password
        await passwordRef.update({
          confidenceScore: -100 // Heavily penalize
        });
        console.log(`Password ${data.targetId} penalized due to multiple reports.`);
      }
    }
  });

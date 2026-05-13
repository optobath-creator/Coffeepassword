import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  reputation: number;
  badges: string[];
  createdAt: Timestamp | Date;
  isAnonymous: boolean;
}

export interface WifiPassword {
  id: string;
  shopId: string;
  password: string;
  ssid?: string;
  upvotes: number;
  downvotes: number;
  confirmations: number;
  confidenceScore: number;
  lastConfirmed: Timestamp | Date;
  submittedBy: string;
  comment?: string;
  createdAt: Timestamp | Date;
}

export interface CoffeeShop {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  wifiAvailability: "Available" | "Limited" | "None";
  features: string[];
  status: "Open" | "Closed";
  website?: string;
  lastUpdated: Timestamp | Date;
  topPassword?: WifiPassword;
}

export interface Vote {
  id: string;
  userId: string;
  passwordId: string;
  type: "up" | "down" | "confirm" | "fail";
  createdAt: Timestamp | Date;
}

export interface Favorite {
  id: string;
  userId: string;
  shopId: string;
  createdAt: Timestamp | Date;
}

export interface Report {
  id: string;
  userId: string;
  targetId: string; // shopId or passwordId
  targetType: "shop" | "password";
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: Timestamp | Date;
}

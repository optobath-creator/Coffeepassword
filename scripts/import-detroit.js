import * as admin from "firebase-admin";
import axios from "axios";

// To run this:
// 1. Download your service account key from Firebase Console
// 2. Set GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"
// 3. node import-detroit.js

const projectId = "coffeepassword";
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: projectId
});

const db = admin.firestore();

const OVERPASS_QUERY = `
[out:json][timeout:90];
area["name"="Michigan"]["admin_level"="4"]->.state;
(
  area["name"="Wayne County"]["admin_level"="6"](area.state);
  area["name"="Oakland County"]["admin_level"="6"](area.state);
  area["name"="Macomb County"]["admin_level"="6"](area.state);
) -> .searchArea;
(
  nwr["amenity"="cafe"](area.searchArea);
  nwr["shop"="coffee"](area.searchArea);
);
out center;
`;

async function importData() {
  let elements = [];
  
  try {
    const fs = require('fs');
    if (fs.existsSync('./data/detroit-cafes.json')) {
      console.log("Reading data from local JSON file...");
      const rawData = fs.readFileSync('./data/detroit-cafes.json');
      elements = JSON.parse(rawData).elements;
    } else {
      console.log("Fetching data from Overpass API...");
      const response = await axios.post("https://overpass-api.de/api/interpreter", OVERPASS_QUERY);
      elements = response.data.elements;
    }
    
    console.log(`Found ${elements.length} potential coffee shops.`);
    
    const batch = db.batch();
    let count = 0;

    for (const el of elements) {
      if (!el.tags || !el.tags.name) continue;

      const shopId = `osm-${el.id}`;
      const shopRef = db.collection("coffeeShops").doc(shopId);
      
      const lat = el.lat || (el.center && el.center.lat);
      const lon = el.lon || (el.center && el.center.lon);

      if (!lat || !lon) continue;

      const shopData = {
        name: el.tags.name,
        address: el.tags["addr:full"] || `${el.tags["addr:housenumber"] || ""} ${el.tags["addr:street"] || ""}`.trim() || "Address not listed",
        coordinates: {
          latitude: lat,
          longitude: lon
        },
        rating: 4.0, // Default rating
        wifiAvailability: "Available", // Default assumption
        features: ["Detroit Local"],
        status: "Open",
        website: el.tags.website || "",
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      };

      batch.set(shopRef, shopData);
      count++;

      // Firestore batches are limited to 500 writes
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Committed ${count} shops...`);
      }
    }

    await batch.commit();
    console.log(`Successfully imported ${count} coffee shops to Firestore!`);

  } catch (error) {
    console.error("Error importing data:", error);
  }
}

importData();

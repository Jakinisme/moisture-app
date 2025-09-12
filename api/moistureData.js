import admin from "firebase-admin";
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.headers['x-api-key'] !== import.meta.env.VITE_FIREBASE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { moisture, status, dataType } = req.body;

  if (typeof moisture !== "number") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const ts = Date.now();
    const dateKey = new Date(ts).toISOString().split("T")[0];
    const soilRef = db.ref("soil");

    if (dataType === "current") {
      await soilRef.child("current").set({
        moisture,
        status,
        timestamp: ts,
      });
    } else if (dataType === "daily") {
      await soilRef.child("history").child(dateKey).set({
        moisture,
        timestamp: ts,
      });
    } else {
      return res.status(400).json({ error: "Invalid dataType" });
    }

    return res.status(200).json({ success: true, message: "Data updated" });
  } catch (err) {
    console.error("DB write error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}
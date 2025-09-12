import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { moisture, status } = req.body;

  if (typeof moisture !== "number" || typeof status !== "string") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const ts = Date.now();
    const dateKey = new Date(ts).toISOString().split("T")[0];

    const soilRef = db.ref("soil");

    await soilRef.child("current").set({
      moisture,
      status,
      timestamp: ts,
    });

    await soilRef.child("history").child(dateKey).push({
      moisture,
      timestamp: ts,
    });

    return res.status(200).json({ success: true, message: "Soil data updated" });
  } catch (err) {
    console.error("DB write error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}

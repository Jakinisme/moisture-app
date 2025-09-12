import admin from "firebase-admin";

// === INIT FIREBASE ===
// Cegah multiple init (Vercel re-use function container)
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

  const { moisture, status, sensorId } = req.body;

  if (typeof moisture !== "number" || typeof status !== "string") {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const ref = db.ref("sensors").child(sensorId || "unknown");
    await ref.push({
      moisture,
      status,
      ts: Date.now(),
    });

    return res.status(200).json({ success: true, message: "Data saved to Realtime DB" });
  } catch (err) {
    console.error("DB write error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}

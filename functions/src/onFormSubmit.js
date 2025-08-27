import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import { defineSecret } from "firebase-functions/params";

initializeApp({
  projectId: "best-tree-service-a1029",
});


const db = getFirestore();

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");


console.log("Project ID:", process.env.GCLOUD_PROJECT);
console.log("FIREBASE_CONFIG:", process.env.FIREBASE_CONFIG);

const corsHandler = cors({
  origin: ["http://localhost:3000", "https://best-tree-service.vercel.app"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});

export const onFormSubmit = onRequest(
  {
    region: "us-central1",
    secrets: [SENDGRID_API_KEY],
  },

  async (req, res) => {
    console.log("🔥 Incoming request to onFormSubmit");

    await new Promise((resolve, reject) => {
      corsHandler(req, res, (err) => (err ? reject(err) : resolve()));
    });
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const { name, email, phone, address, message } = req.body || {};
    console.log("📩 Form data received:", {
      name,
      email,
      phone,
      address,
      message,
    });

    if (!name || !email) {
      console.warn("⚠️ Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: name and email." });
    }

    const sendgridApiKey = SENDGRID_API_KEY.value();
    if (!sendgridApiKey) {
      console.error("❌ SENDGRID_API_KEY is undefined");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    sgMail.setApiKey(sendgridApiKey);
    console.log("✅ SendGrid API key set");

    try {
      console.log("📦 Attempting Firestore write...");
      const submissionRef = await db.collection("submissions").add({
        name,
        email,
        phone: phone || null,
        address: address || null,
        message: message || null,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log("✅ Firestore write successful:", submissionRef.id);

      const ownerMsg = {
        to: "Joaquinmorales5613@gmail.com",
        from: "Joaquinmorales5613@gmail.com",
        subject: `New Estimate Request from ${name}`,
        text: JSON.stringify(
          {
            id: submissionRef.id,
            name,
            email,
            phone,
            address,
            message,
            receivedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      };
      console.log("📨 Preparing email...");

      await sgMail.send(ownerMsg);
      console.log("✅ Email sent");

  return res
        .status(200)
        .json({ status: "success", submissionId: submissionRef.id });
    } catch (err) {
      console.error("🔥 onFormSubmit error:", err.message, err.stack);
      return res.status(500).json({ error: `Firestore error: ${err.message}` });
    }
  }
);

export const testWrite = onRequest(async (req, res) => {
  console.log("📥 testWrite triggered");

  try {
    const db = getFirestore();
    console.log("✅ Firestore instance acquired");

    const docRef = db.collection("submissions").doc();
    console.log("📄 Document reference created:", docRef.id);

    await docRef.set({
      name: "Test User",
      timestamp: new Date().toISOString(),
    });

    console.log("✅ Firestore write successful");
    res.status(200).send("✅ Firestore write successful");
  } catch (err) {
    console.error("🔥 Firestore write failed:", err.message);
    console.error("🧵 Stack trace:", err.stack);
    res.status(500).send("❌ Firestore write failed");
  }
});

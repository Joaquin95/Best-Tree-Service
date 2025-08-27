import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import sgMail from "@sendgrid/mail";
import cors from "cors";

initializeApp();

const db = getFirestore();


const corsHandler = cors({
  origin: ["http://localhost:3000", "https://best-tree-service.vercel.app"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});

export const onFormSubmit = onRequest(
  { region: "us-central1" },
  async (req, res) => {
    await new Promise((resolve, reject) => {
      corsHandler(req, res, (err) => (err ? reject(err) : resolve()));
    });
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const { name, email, phone, address, message } = req.body || {};
    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name and email." });
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error("❌ Missing SENDGRID_API_KEY");
      return res.status(500).json({ error: "Server misconfiguration" });
    }
    sgMail.setApiKey(sendgridApiKey);

    try {
      const submissionRef = await db.collection("submissions").add({
        name,
        email,
        phone: phone || null,
        address: address || null,
        message: message || null,
        createdAt:  FieldValue.serverTimestamp(),
      });

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

      await sgMail.send(ownerMsg);

       return res
        .status(200)
        .json({ status: "success", submissionId: submissionRef.id });
    } catch (err) {
      console.error("🔥 onFormSubmit error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

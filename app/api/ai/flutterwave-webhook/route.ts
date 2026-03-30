import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();

  const flwData = body.data;
  const txRef = flwData.tx_ref;

  // Example: if tx_ref was "tools-<userId>-<timestamp>"
  const parts = txRef.split("-");
  const userId = parts[1]; // adjust if your format is different

  if (!userId) {
    return NextResponse.json(
      { ok: false, reason: "Missing userId" },
      { status: 400 }
    );
  }

  await setDoc(
    doc(db, "toolSubs", userId),
    {
      active: true,
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    { merge: true }
  );

  await updateDoc(doc(db, "users", userId), { hasToolsSub: true });

  return NextResponse.json({ ok: true });
}
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { patientId, doctorId, meds, notes }
    if (!body || !body.patientId || !body.meds)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const presRef = await adminDb.collection("prescriptions").add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Create simple PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText(`Prescription for patient ${body.patientId}`, {
      x: 50,
      y: 750,
      size: 14,
      font,
    });
    let y = 720;
    body.meds.forEach((m: any) => {
      page.drawText(`${m.name} — ${m.dose} — ${m.frequency}`, {
        x: 50,
        y,
        size: 12,
        font,
      });
      y -= 20;
    });
    const pdfBytes = await pdfDoc.save();

    const filePath = `prescriptions/${presRef.id}.pdf`;
    const file = adminStorage.file(filePath);
    await file.save(Buffer.from(pdfBytes), {
      metadata: {
        contentType: "application/pdf",
        metadata: { patientId: body.patientId },
      },
    });
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    await presRef.update({ pdfUrl: url, storagePath: filePath });

    return NextResponse.json({ id: presRef.id, pdfUrl: url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 },
    );
  }
}

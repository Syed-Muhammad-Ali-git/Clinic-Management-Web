import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

const hasBucket = !!process.env.FIREBASE_STORAGE_BUCKET;

async function uploadPdf(id: string, pdfBytes: Uint8Array, patientId: string) {
  if (!hasBucket) return null;
  // Lazy import so build doesn't fail when bucket env is missing
  const { getAdminStorage } = await import("@/lib/firebaseAdmin");
  const bucket = getAdminStorage().bucket();
  const file = bucket.file(`prescriptions/${id}.pdf`);
  await file.save(Buffer.from(pdfBytes), {
    metadata: { contentType: "application/pdf", metadata: { patientId } },
  });
  const [url] = await file.getSignedUrl({ action: "read", expires: "03-01-2500" });
  return url;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.patientId || !body.meds)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    // Save to Firestore first
    const presRef = await adminDb.collection("prescriptions").add({
      patientId:  body.patientId,
      doctorId:   body.doctorId  ?? "",
      patientName: body.patientName ?? "",
      doctorName:  body.doctorName  ?? "",
      diagnosis:   body.diagnosis   ?? "",
      notes:       body.notes       ?? "",
      medications: (body.meds ?? []).map((m: any) => ({
        name:      m.name      ?? "",
        dosage:    m.dose      ?? "",
        frequency: m.frequency ?? "",
        duration:  m.duration  ?? "",
      })),
      createdAt: FieldValue.serverTimestamp(),
    });

    // Build PDF
    const pdfDoc = await PDFDocument.create();
    const page   = pdfDoc.addPage([600, 820]);
    const bold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const reg    = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const gray   = rgb(0.4, 0.4, 0.4);
    const black  = rgb(0, 0, 0);
    const cyan   = rgb(0.02, 0.71, 0.83);

    // Header
    page.drawRectangle({ x: 0, y: 770, width: 600, height: 50, color: rgb(0.02, 0.09, 0.12) });
    page.drawText("ClinicAI — Prescription", { x: 30, y: 786, size: 16, font: bold, color: rgb(1,1,1) });
    page.drawText(new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }), { x: 450, y: 786, size: 10, font: reg, color: rgb(0.7,0.7,0.7) });

    // Patient / Doctor info
    let y = 740;
    const row = (label: string, value: string) => {
      page.drawText(label, { x: 30, y, size: 9, font: bold, color: gray });
      page.drawText(value || "—", { x: 160, y, size: 10, font: reg, color: black });
      y -= 18;
    };
    row("Patient:",   body.patientName || body.patientId);
    row("Doctor:",    body.doctorName  || body.doctorId || "—");
    row("Diagnosis:", body.diagnosis   || "—");

    // Divider
    y -= 6;
    page.drawLine({ start: { x: 30, y }, end: { x: 570, y }, thickness: 0.5, color: gray });
    y -= 16;

    // Medications header
    page.drawText("MEDICATIONS", { x: 30, y, size: 9, font: bold, color: cyan });
    y -= 16;

    // Medication rows
    (body.meds ?? []).forEach((m: any, i: number) => {
      page.drawText(`${i + 1}.`, { x: 30, y, size: 10, font: bold, color: black });
      page.drawText(m.name || "", { x: 50, y, size: 10, font: bold, color: black });
      page.drawText(`${m.dose || ""}   ${m.frequency || ""}   ${m.duration || ""}`, { x: 200, y, size: 9, font: reg, color: gray });
      y -= 20;
    });

    if (body.notes) {
      y -= 8;
      page.drawLine({ start: { x: 30, y }, end: { x: 570, y }, thickness: 0.5, color: rgb(0.8,0.8,0.8) });
      y -= 14;
      page.drawText("Notes:", { x: 30, y, size: 9, font: bold, color: gray });
      page.drawText(body.notes, { x: 80, y, size: 9, font: reg, color: black });
    }

    const pdfBytes = await pdfDoc.save();

    // Upload to storage (if bucket configured), else return base64
    let pdfUrl: string | null = null;
    try {
      pdfUrl = await uploadPdf(presRef.id, pdfBytes, body.patientId);
    } catch {
      // Storage not configured or failed — not fatal
    }

    const updateData: Record<string, any> = { pdfGenerated: true };
    if (pdfUrl) { updateData.pdfUrl = pdfUrl; updateData.storagePath = `prescriptions/${presRef.id}.pdf`; }
    await presRef.update(updateData);

    return NextResponse.json({
      id: presRef.id,
      pdfUrl,
      // If no storage URL, send base64 so client can still offer download
      pdfBase64: pdfUrl ? undefined : Buffer.from(pdfBytes).toString("base64"),
    });
  } catch (err: any) {
    console.error("[prescriptions API]", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 },
    );
  }
}

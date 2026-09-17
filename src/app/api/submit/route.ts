import { NextResponse } from "next/server";
import { appendRegistrationRows } from "@/lib/googleSheets";
import { buildRegistrationRows } from "@/lib/registrationRows";
import { parseRegistrationPayload } from "@/lib/registrationPayload";

export const runtime = "nodejs";

const HONEYPOT_FIELD = "company";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const honeypot = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseRegistrationPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, errors: parsed.errors },
      { status: 400 }
    );
  }

  const submittedAt = new Date().toISOString();
  const { rows } = buildRegistrationRows(parsed.data, submittedAt);

  try {
    await appendRegistrationRows(rows);
  } catch (error) {
    console.error("Failed to append registration to Google Sheets", error);
    return NextResponse.json(
      { ok: false, error: "Unable to save registration. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, familyId: rows[0]?.[0] ?? null });
}

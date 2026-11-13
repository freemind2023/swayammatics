import type { APIRoute } from "astro";

// Server-rendered endpoint (Vercel Serverless Function)
export const prerender = false;

interface ContactPayload {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  industry: string;
  company_size: string;
  improvements: string[];
  project_description: string;
  preferred_contact_method: string;
  consent: boolean;
  landing_page?: string;
  utm?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input: string): string {
  return input.trim().slice(0, 2000);
}

function validate(body: Partial<ContactPayload>): string | null {
  if (!body.full_name || !sanitize(body.full_name)) return "Full name is required.";
  if (!body.email || !EMAIL_RE.test(body.email.trim())) return "A valid business email is required.";
  if (!body.phone || !sanitize(body.phone)) return "Phone number is required.";
  if (!body.company || !sanitize(body.company)) return "Company name is required.";
  if (!body.industry) return "Please select an industry.";
  if (!body.company_size) return "Please select a company size.";
  if (!Array.isArray(body.improvements) || body.improvements.length === 0)
    return "Please select at least one thing you'd like to improve.";
  if (!body.project_description || !sanitize(body.project_description))
    return "Please describe your project.";
  if (!body.preferred_contact_method) return "Please select a preferred contact method.";
  if (body.consent !== true) return "Consent is required to submit this form.";
  return null;
}

async function createAirtableRecord(
  payload: ContactPayload,
  submissionId: string,
): Promise<{ ok: boolean; recordId?: string; error?: string }> {
  const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME || "Contacts";

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return { ok: false, error: "Airtable is not configured (missing AIRTABLE_API_KEY / AIRTABLE_BASE_ID)." };
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Full Name": payload.full_name,
            Email: payload.email,
            Phone: payload.phone,
            Company: payload.company,
            Website: payload.website || "",
            Industry: payload.industry,
            "Company Size": payload.company_size,
            "What to Improve": payload.improvements.join(", "),
            "Project Description": payload.project_description,
            "Preferred Contact Method": payload.preferred_contact_method,
            Consent: payload.consent,
            "Lead Status": "New Lead",
            "Lead Source": "Website Contact Form",
            "Landing Page": payload.landing_page || "",
            "UTM Parameters": payload.utm || "",
            "Submission ID": submissionId,
            "Submission Date": new Date().toISOString(),
          },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Airtable API error ${res.status}:`, errText);
      return { ok: false, error: "Failed to save your enquiry. Please try again." };
    }

    const result = await res.json();
    return { ok: true, recordId: result.id };
  } catch (err) {
    console.error("Airtable request failed:", err);
    return { ok: false, error: "Failed to save your enquiry. Please try again." };
  }
}

async function upsertResendContact(payload: ContactPayload): Promise<void> {
  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
  const RESEND_AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    console.warn("Resend contact sync skipped: missing RESEND_API_KEY / RESEND_AUDIENCE_ID.");
    return;
  }

  const [firstName, ...rest] = payload.full_name.trim().split(/\s+/);

  try {
    // Resend upserts by email automatically when creating against an audience.
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        first_name: firstName,
        last_name: rest.join(" "),
        // Enquiries are not marketing opt-ins — do not subscribe by default.
        unsubscribed: true,
      }),
    });
    if (!res.ok) {
      console.error("Resend contact upsert failed:", await res.text());
    }
  } catch (err) {
    console.error("Resend contact upsert error:", err);
  }
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
  const RESEND_FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    console.warn("Resend email skipped: missing RESEND_API_KEY / RESEND_FROM_EMAIL.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`Resend email error (${subject}):`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Resend email request failed (${subject}):`, err);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request body." }, 400);
  }

  const validationError = validate(body);
  if (validationError) {
    return json({ success: false, error: validationError }, 400);
  }

  const payload: ContactPayload = {
    full_name: sanitize(body.full_name!),
    email: body.email!.trim().toLowerCase(),
    phone: sanitize(body.phone!),
    company: sanitize(body.company!),
    website: body.website ? sanitize(body.website) : "",
    industry: body.industry!,
    company_size: body.company_size!,
    improvements: body.improvements!.map((i) => sanitize(String(i))),
    project_description: sanitize(body.project_description!),
    preferred_contact_method: body.preferred_contact_method!,
    consent: true,
    landing_page: body.landing_page ? sanitize(body.landing_page) : "",
    utm: body.utm ? sanitize(body.utm) : "",
  };

  const submissionId = crypto.randomUUID();

  // Airtable is the system of record — a lead is never considered "received" without it.
  const airtableResult = await createAirtableRecord(payload, submissionId);
  if (!airtableResult.ok) {
    return json({ success: false, error: airtableResult.error }, 502);
  }

  // Secondary integrations: best-effort. Failures here must not lose the lead
  // or block the success response, since Airtable already has it.
  await upsertResendContact(payload);

  await sendResendEmail(
    import.meta.env.NOTIFY_EMAIL || import.meta.env.RESEND_FROM_EMAIL,
    `New enquiry: ${payload.company} (${payload.industry})`,
    `
      <p><strong>Name:</strong> ${payload.full_name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Company:</strong> ${payload.company}</p>
      <p><strong>Website:</strong> ${payload.website || "-"}</p>
      <p><strong>Industry:</strong> ${payload.industry}</p>
      <p><strong>Company size:</strong> ${payload.company_size}</p>
      <p><strong>Wants to improve:</strong> ${payload.improvements.join(", ")}</p>
      <p><strong>Preferred contact method:</strong> ${payload.preferred_contact_method}</p>
      <p><strong>Project description:</strong><br>${payload.project_description.replace(/\n/g, "<br>")}</p>
      <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
      <p><strong>Airtable record:</strong> ${airtableResult.recordId}</p>
    `,
  );

  await sendResendEmail(
    payload.email,
    "We received your enquiry | Swayammatics",
    `
      <p>Hello ${payload.full_name},</p>
      <p>Thank you for reaching out to Swayammatics.</p>
      <p>We have received your enquiry and appreciate your interest in working with us.
      Our team will review your requirements and get in touch with you.</p>
      <p>Regards,<br>Swayammatics Team<br>AUTOMATE | INTEGRATE | TRANSFORM</p>
    `,
  );

  return json({ success: true, submissionId }, 200);
};

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

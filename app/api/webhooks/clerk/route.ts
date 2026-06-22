import { verifyWebhook } from "@clerk/backend/webhooks";
import { buildAuthEmail } from "@/lib/emails/brandedAuthEmail";
import { sendAuthEmail } from "@/lib/emails/sendAuthEmail";

export const runtime = "nodejs";

/** Clerk auth emails — branded HTML via Resend (Hobby plan workaround). */
export async function POST(req: Request) {
  let event;
  try {
    event = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk-webhook] verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "email.created") {
    return new Response("Ignored", { status: 200 });
  }

  const email = event.data;
  const to = email.to_email_address?.trim();
  const slug = email.slug?.trim();

  if (!to || !slug) {
    console.warn("[clerk-webhook] email.created missing to or slug");
    return new Response("Missing fields", { status: 400 });
  }

  if (email.delivered_by_clerk) {
    return new Response("Clerk delivery enabled — skipped", { status: 200 });
  }

  const content = buildAuthEmail(slug, email.data ?? null);
  if (!content) {
    console.warn(`[clerk-webhook] unsupported slug: ${slug}`);
    return new Response("Unsupported template", { status: 200 });
  }

  try {
    await sendAuthEmail({
      to,
      subject: content.subject,
      html: content.html,
      text: content.text,
      fromLocalPart: email.from_email_name || "notifications",
    });
  } catch (err) {
    console.error("[clerk-webhook] send failed:", err);
    return new Response("Send failed", { status: 500 });
  }

  return new Response("Sent", { status: 200 });
}

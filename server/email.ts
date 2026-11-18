type ResendMessage = {
  to: string | string[];
  subject: string;
  html: string;
};

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM_EMAIL,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendResendEmail(message: ResendMessage) {
  const { apiKey, from } = getEmailConfig();
  if (!apiKey || !from) {
    console.warn("[Email] Resend is not configured; email was not sent.");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...message }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`[Email] Resend request failed (${response.status}): ${detail.slice(0, 300)}`);
    return false;
  }

  return true;
}

export async function sendSubscriberWelcome(email: string) {
  return sendResendEmail({
    to: email,
    subject: "You’re on the NEWCOMER list",
    html: `<div style="background:#0a0a0a;color:#f2f0ea;font-family:Arial,sans-serif;padding:36px;line-height:1.6"><p style="color:#f05d23;letter-spacing:.18em;text-transform:uppercase;font-size:11px;font-weight:700">NEWCOMER / THE SIGNAL</p><h1 style="font-size:36px;line-height:1.05;margin:22px 0">You’re on the list.</h1><p style="color:#c2c1bc;max-width:520px">Thanks for subscribing to official NEWCOMER announcements and community updates. We’ll only send confirmed news from the project.</p><p style="color:#8e8e8b;font-size:12px;margin-top:30px">Inspired by Melbourne, Australia. In development.<br />To unsubscribe, contact the team through the support page.</p></div>`,
  });
}

export async function sendAnnouncementEmail(input: { email: string; subject: string; title: string; body: string }) {
  const safeTitle = escapeHtml(input.title);
  const safeBody = escapeHtml(input.body).replaceAll("\n", "<br />");
  return sendResendEmail({
    to: input.email,
    subject: input.subject,
    html: `<div style="background:#0a0a0a;color:#f2f0ea;font-family:Arial,sans-serif;padding:36px;line-height:1.6"><p style="color:#f05d23;letter-spacing:.18em;text-transform:uppercase;font-size:11px;font-weight:700">NEWCOMER / OFFICIAL UPDATE</p><h1 style="font-size:36px;line-height:1.05;margin:22px 0">${safeTitle}</h1><p style="color:#c2c1bc;max-width:560px">${safeBody}</p><p style="color:#8e8e8b;font-size:12px;margin-top:30px">You’re receiving this because you signed up for NEWCOMER announcements and community updates.</p></div>`,
  });
}

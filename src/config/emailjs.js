/**
 * EmailJS — https://www.emailjs.com/
 *
 * The app sends: user_name, user_email, message, to_email, reply_to
 *
 * In the EmailJS dashboard open your template and set:
 *
 * 1) TO EMAIL (who receives the form) — MUST be you, not the visitor.
 *    - Either type your address literally: khawaja.mr@hotmail.com
 *    - Or use the variable: {{to_email}}  (we send your address in to_email)
 *    Do NOT put {{user_email}} here — that sends the mail to the visitor and you won’t see it.
 *
 * 2) REPLY TO — so “Reply” in Outlook/Gmail goes to the person who filled the form.
 *    Set to: {{reply_to}}   or   {{user_email}}
 *    If this is blank or wrong, replies can go to your own address.
 *
 * 3) Body: use {{user_name}}, {{user_email}}, {{message}} — or {{from_name}} / {{from_email}}
 *    if your template says “A message by {{from_name}}…” (we send both sets).
 *
 * 4) “Email sent via EmailJS.com” at the bottom is added by EmailJS, not this app.
 *    Removing it usually requires a paid EmailJS plan (see Account / pricing on emailjs.com).
 *
 * .env (restart dev server after edits):
 *   VITE_EMAILJS_SERVICE_ID=...
 *   VITE_EMAILJS_TEMPLATE_ID=...
 *   VITE_EMAILJS_PUBLIC_KEY=...
 */
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "service_1dhs32e",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "",
};

export function isEmailJsConfigured() {
  return Boolean(emailjsConfig.templateId && emailjsConfig.publicKey);
}

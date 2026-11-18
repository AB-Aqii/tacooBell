import type { ContactInput } from "./contact-schema";

export type SendResult = { status: "success" } | { status: "unavailable" } | { status: "error" };

export async function sendContactMessage(input: ContactInput): Promise<SendResult> {
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
  if (!endpoint) return { status: "unavailable" };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return response.ok ? { status: "success" } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

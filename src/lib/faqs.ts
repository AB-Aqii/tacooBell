import { faqs } from "@/data/faqs";
import type { Faq } from "@/types/faq";

export async function getFaqs(options: { homepageOnly?: boolean } = {}): Promise<Faq[]> {
  return options.homepageOnly ? faqs.filter((faq) => faq.homepage) : faqs;
}

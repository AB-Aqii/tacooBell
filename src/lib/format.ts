const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .filter((letter) => /[A-Za-z0-9]/.test(letter))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

import { buildSearchIndex } from "@/lib/search/build-index";

export const dynamic = "force-static";

export async function GET() {
  const index = await buildSearchIndex();
  return Response.json(index, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

import { fetchGitHubStats } from "@/util/github";

// Required by `output: 'export'`: the response is generated once at build time
export const dynamic = "force-static";

export async function GET() {
  try {
    return Response.json(await fetchGitHubStats());
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load GitHub stats" }, { status: 500 });
  }
}

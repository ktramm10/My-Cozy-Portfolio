import { fetchGitHubStats } from "@/util/github";

// Cached response, regenerated in the background at most once an hour
export const revalidate = 3600;

// Errors are thrown rather than caught: during revalidation Next keeps serving the last good
// stats instead of caching an error. A failure at build time fails the build, so it gets noticed.
export async function GET() {
  return Response.json(await fetchGitHubStats());
}

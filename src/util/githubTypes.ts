export const GITHUB_USERNAME = "ktramm10";

type ContributionDay = { date: string; contributionCount: number };

export type GitHubStats = {
  repos: number;
  stars: number;
  followers: number;
  contributions: number;
  topLanguages: { name: string; count: number }[];
  calendar: { contributionDays: ContributionDay[] }[];
};

export function isGitHubStats(data: unknown): data is GitHubStats {
  if (!data || typeof data !== "object" || "error" in data) return false;
  const stats = data as Partial<GitHubStats>;
  return (
    typeof stats.contributions === "number" &&
    Array.isArray(stats.topLanguages) &&
    Array.isArray(stats.calendar)
  );
}

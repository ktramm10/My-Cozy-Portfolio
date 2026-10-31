// Server-only GitHub helpers. Types are safe to import from client components.
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
export const GITHUB_USERNAME = "ktramm10";
const TOP_LANGUAGE_COUNT = 5;

type ContributionDay = { date: string; contributionCount: number };

export type GitHubStats = {
  repos: number;
  stars: number;
  followers: number;
  contributions: number;
  topLanguages: { name: string; count: number }[];
  calendar: { contributionDays: ContributionDay[] }[];
};

type RepoNode = { stargazerCount: number; primaryLanguage: { name: string } | null };

const statsQuery = `
  query($login: String!) {
    user(login: $login) {
      followers { totalCount }
      repositories(ownerAffiliations: OWNER, first: 100, isFork: false) {
        totalCount
        nodes { stargazerCount primaryLanguage { name } }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;

// Generic GraphQL caller so new queries can reuse auth and error handling
async function githubGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN");

  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`GitHub API error: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.data as T;
}

// Count how many repos use each language, then keep the top few
function getTopLanguages(repos: RepoNode[]) {
  const langCounts: Record<string, number> = {};
  for (const repo of repos) {
    const lang = repo.primaryLanguage?.name;
    if (lang) langCounts[lang] = (langCounts[lang] ?? 0) + 1;
  }
  return Object.entries(langCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_LANGUAGE_COUNT);
}

export async function fetchGitHubStats(login: string = GITHUB_USERNAME): Promise<GitHubStats> {
  const { user } = await githubGraphQL<{ user: any }>(statsQuery, { login });
  const repos: RepoNode[] = user.repositories.nodes;
  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    repos: user.repositories.totalCount,
    stars: repos.reduce((sum, r) => sum + r.stargazerCount, 0),
    followers: user.followers.totalCount,
    contributions: calendar.totalContributions,
    topLanguages: getTopLanguages(repos),
    calendar: calendar.weeks,
  };
}

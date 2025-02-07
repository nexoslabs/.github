import { CONFIG, GITHUB_ACCESS_TOKEN } from './constants.js';
import {
  fetchNPMPackages,
  fetchNPMPackageDownloads,
  fetchGitHubUserinfo,
  fetchGitHubRepositories,
  fetchGitHubOrganizations,
  fetchGitHubRepositoryLanguages
} from './fetchers.js';

// 🛠 Fetch and aggregate NPM data
export const getNPMAggregate = async () => {
  try {
    console.info(`[INFO] ${new Date().toISOString()} - Fetching NPM packages for ${CONFIG.NPM_UID}`);

    const packages = await fetchNPMPackages(CONFIG.NPM_UID);

    // ✅ Ensure the API response structure is valid
    if (!packages || !packages.objects || !Array.isArray(packages.objects)) {
      console.error(`[ERROR] ${new Date().toISOString()} - Invalid NPM API response`);
      throw new Error("Invalid response from npm API: Expected an array.");
    }

    const packageDownloadsMap = new Map();

    await Promise.all(packages.objects.map(async (item) => {
      try {
        const downloads = await fetchNPMPackageDownloads(item.package.name);
        packageDownloadsMap.set(item.package.name, downloads?.downloads || 0);
      } catch (error) {
        console.warn(`[WARN] ${new Date().toISOString()} - Failed to fetch downloads for ${item.package.name}`);
      }
    }));

    console.info(`[INFO] ${new Date().toISOString()} - Successfully fetched ${packageDownloadsMap.size} NPM packages.`);

    return {
      packages: packages.objects,
      packageCount: packageDownloadsMap.size,
      packageDownloadsTotal: Array.from(packageDownloadsMap.values()).reduce((a, b) => a + b, 0)
    };
  } catch (error) {
    console.error(`[ERROR] ${new Date().toISOString()} - Failed to fetch NPM data: ${error.message}`);
    throw error;
  }
};

// 🏆 Fetch and aggregate GitHub data
export const getGitHubAggregate = async () => {
  try {
    console.info(`[INFO] ${new Date().toISOString()} - Fetching GitHub data for ${CONFIG.GITHUB_UID}`);

    const [userinfo, repositories, organizations, repoLanguages] = await Promise.all([
      fetchGitHubUserinfo(CONFIG.GITHUB_UID, GITHUB_ACCESS_TOKEN),
      fetchGitHubRepositories(CONFIG.GITHUB_UID, GITHUB_ACCESS_TOKEN),
      fetchGitHubOrganizations(CONFIG.GITHUB_UID, GITHUB_ACCESS_TOKEN),
      fetchGitHubRepositoryLanguages(CONFIG.GITHUB_UID, GITHUB_ACCESS_TOKEN)
    ]);

    if (!repositories || !Array.isArray(repositories)) {
      console.error(`[ERROR] ${new Date().toISOString()} - Invalid GitHub repository response`);
      throw new Error("Invalid GitHub response: Expected an array of repositories.");
    }

    // 🏆 Aggregate statistics from repositories
    const statistics = repositories.reduce((stats, repo) => {
      stats.stars += repo.stargazers_count || 0;
      stats.forks += repo.forks_count || 0;
      stats.open_issues += repo.open_issues || 0;
      return stats;
    }, { stars: 0, forks: 0, open_issues: 0 });

    console.info(`[INFO] ${new Date().toISOString()} - Successfully fetched ${repositories.length} GitHub repositories.`);

    return {
      userinfo,
      repositories,
      organizations,
      statistics
    };
  } catch (error) {
    console.error(`[ERROR] ${new Date().toISOString()} - Failed to fetch GitHub data: ${error.message}`);
    throw error;
  }
};

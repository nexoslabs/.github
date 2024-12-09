import { CONFIG, GITHUB_ACCESS_TOKEN } from './constants.js';
import {
    fetchNPMPackages,
    fetchNPMPackageDownloads,
    fetchGitHubUserinfo,
    fetchGitHubRepositories,
    fetchGitHubOrganizations,
    fetchGitHubRepositoryLanguages
} from './fetchers.js';

export const getNPMAggregate = async () => {
    const packages = await fetchNPMPackages(CONFIG.NPM_UID);
    const packageDownloadsMap = new Map();

    await Promise.all(packages.map(async (item) => {
        const downloads = await fetchNPMPackageDownloads(item.package.name);
        packageDownloadsMap.set(item.package.name, downloads?.downloads || 0);
    }));

    return {
        packages,
        packageCount: packageDownloadsMap.size,
        packageDownloadsTotal: Array.from(packageDownloadsMap.values()).reduce((a, b) => a + b, 0)
    };
};

export const getGitHubAggregate = async () => {
    const [userinfo, repositories, organizations, repoLanguages] = await Promise.all([
        fetchGitHubUserinfo(CONFIG.GITHUB_UID),
        fetchGitHubRepositories(CONFIG.GITHUB_UID),
        fetchGitHubOrganizations(CONFIG.GITHUB_UID),
        fetchGitHubRepositoryLanguages(CONFIG.GITHUB_UID, GITHUB_ACCESS_TOKEN)
    ]);

    const statistics = repositories.reduce((stats, repo) => {
        stats.stars += repo.stargazers_count;
        stats.forks += repo.forks_count;
        stats.open_issues += repo.open_issues;
        return stats;
    }, { stars: 0, forks: 0, open_issues: 0 });

    return {
        userinfo,
        repositories,
        organizations,
        statistics
    };
};

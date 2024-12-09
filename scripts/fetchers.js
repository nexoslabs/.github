import axios from 'axios';

// Axios interceptor for logging errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Fetch failed:', error.message);
        return Promise.reject(error);
    }
);

// Retry logic for API requests
const fetchWithRetry = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios({ url, ...options });
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error; // Re-throw error on final attempt
            console.warn(`Retrying ${url} (${i + 1}/${retries})...`);
        }
    }
};

// Fetch npm packages
export const fetchNPMPackages = async (npmUID) => {
    return fetchWithRetry(`https://registry.npmjs.com/-/v1/search?text=maintainer:${npmUID}`);
};

// Fetch npm package downloads
export const fetchNPMPackageDownloads = async (packageName) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    return fetchWithRetry(`https://api.npmjs.org/downloads/point/2015-01-10:${today}/${packageName}`);
};

// Fetch GitHub user info
export const fetchGitHubUserinfo = async (githubUID) => {
    return fetchWithRetry(`https://api.github.com/users/${githubUID}`);
};

// Fetch GitHub repositories
export const fetchGitHubRepositories = async (githubUID) => {
    return fetchWithRetry(`https://api.github.com/users/${githubUID}/repos?per_page=100`);
};

// Fetch GitHub organizations
export const fetchGitHubOrganizations = async (githubUID) => {
    return fetchWithRetry(`https://api.github.com/users/${githubUID}/orgs`);
};

// Fetch repository languages via GitHub GraphQL
export const fetchGitHubRepositoryLanguages = async (githubUID, githubToken) => {
    const query = `
    query {
      user(login: "${githubUID}") {
        repositories(first: 100, isFork: false, ownerAffiliations: OWNER) {
          nodes {
            name
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node { name, color }
              }
            }
          }
        }
      }
    }`;

    const response = await axios.post('https://api.github.com/graphql', { query }, {
        headers: { Authorization: `Bearer ${githubToken}` }
    });

    if (response.data.errors) {
        throw new Error(response.data.errors.map(e => e.message).join('; '));
    }

    return response.data.data.user.repositories.nodes;
};

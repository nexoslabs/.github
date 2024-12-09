import { thousands, writeJSONToOutput } from './utils.js';
import { getGitHubAggregate, getNPMAggregate } from './aggregates.js';

async function generateReports() {
    try {
        const now = new Date();
        console.info('Starting generation:', now.toLocaleString());

        // Fetch aggregates
        console.info('Fetching GitHub and npm aggregates...');
        const [GitHubData] = await Promise.all([    // , NPMData
            getGitHubAggregate(),
            // getNPMAggregate()
        ]);

        // Save Project Data
        const projectData = { GitHub: GitHubData };  // , npm: NPMData
        writeJSONToOutput('project.json', projectData);

        // Shields.io JSON files
        writeJSONToOutput('shields.project.repos.json', {
            schemaVersion: 1,
            label: 'GitHub Repos',
            message: thousands(GitHubData.repositories.length),
            cacheSeconds: 3600
        });

        writeJSONToOutput('shields.project.stars.json', {
            schemaVersion: 1,
            label: 'GitHub Stars',
            message: thousands(GitHubData.statistics.stars),
            cacheSeconds: 3600
        });

        // writeJSONToOutput('shields.npm.downloads.json', {
        //     schemaVersion: 1,
        //     label: 'npm Downloads',
        //     message: thousands(NPMData.packageDownloadsTotal),
        //     cacheSeconds: 3600
        // });

        console.info('Report generation completed successfully.');
    } catch (error) {
        console.error('Error during report generation:', error.message);
        process.exit(1);
    }
}

generateReports();

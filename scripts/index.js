import { thousands, writeJSONToOutput } from './utils.js';
import { getGitHubAggregate, getNPMAggregate } from './aggregates.js';

async function generateReports() {
  const startTime = Date.now();
  console.info(`[INFO] ${new Date().toISOString()} - Starting report generation...`);

  try {
    console.info(`[INFO] ${new Date().toISOString()} - Fetching GitHub and npm aggregates...`);

    // Start fetching GitHub & NPM data
    const [GitHubData, NPMData] = await Promise.all([
      getGitHubAggregate().catch(err => {
        console.error(`[ERROR] ${new Date().toISOString()} - GitHub fetch failed: ${err.message}`);
        return null;  // Continue execution even if GitHub fails
      }),
      getNPMAggregate().catch(err => {
        console.error(`[ERROR] ${new Date().toISOString()} - npm fetch failed: ${err.message}`);
        return null;
      })
    ]);

    // If both fail, exit with an error
    if (!GitHubData && !NPMData) {
      console.error(`[FATAL] ${new Date().toISOString()} - Both GitHub and npm data failed. Exiting...`);
      process.exit(1);
    }

    console.info(`[INFO] ${new Date().toISOString()} - Data fetched successfully.`);

    // Save Project Data
    if (GitHubData) {
      writeJSONToOutput('github.json', { GitHub: GitHubData });
      console.info(`[INFO] ${new Date().toISOString()} - GitHub data saved.`);
    }
    if (NPMData) {
      writeJSONToOutput('npm.json', { npm: NPMData });
      console.info(`[INFO] ${new Date().toISOString()} - npm data saved.`);
    }

    // Shields.io JSON files
    if (GitHubData) {
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

      console.info(`[INFO] ${new Date().toISOString()} - GitHub shields saved.`);
    }

    if (NPMData) {
      writeJSONToOutput('shields.npm.packages.json', {
        schemaVersion: 1,
        label: 'Total Packages',
        message: thousands(NPMData.packageCount),
        cacheSeconds: 3600
      });

      writeJSONToOutput('shields.npm.downloads.json', {
        schemaVersion: 1,
        label: 'Total Downloads',
        message: thousands(NPMData.packageDownloadsTotal),
        cacheSeconds: 3600
      });

      console.info(`[INFO] ${new Date().toISOString()} - npm shields saved.`);
    }

    // Calculate execution time
    const endTime = Date.now();
    console.info(`[SUCCESS] ${new Date().toISOString()} - Report generation completed in ${(endTime - startTime) / 1000}s.`);
  } catch (error) {
    console.error(`[FATAL] ${new Date().toISOString()} - Error during report generation: ${error.message}`);
    process.exit(1);
  }
}

generateReports();

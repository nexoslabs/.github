import { thousands, writeJSONToOutput } from './utils.js'
import { getProjectsAggregate } from './aggregates.js'

try {
    const now = new Date();
    console.info('Generating:', now.toLocaleString(), '|', now.toString());
    console.log();

    // Aggregates
    const ProjectData = await getProjectsAggregate();

    // Project JSON
    writeJSONToOutput('project.json', { ...ProjectData });

    // shields JSON
    writeJSONToOutput('shields.project.likes.json', {
        schemaVersion: 1,
        label: 'Project Activity',
        message: thousands(ProjectData.likesTotal), // Project Count
        cacheSeconds: 3600
    });

    writeJSONToOutput('shields.project.stars.json', {
        schemaVersion: 1,
        label: 'Project Stars',
        message: thousands(ProjectData.starsTotal), // Project stars
        cacheSeconds: 3600
    });

    console.log();
    console.info('All generation has been completed.');
    process.exit(0);
} catch (error) {
    console.error('Generate JSON error!', error);
    process.exit(1);
}

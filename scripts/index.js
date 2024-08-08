import { thousands, writeJSONToOutput } from './utils.js'
import { getCraftlandAggregate } from './aggregates.js'

try {
  const now = new Date();
  console.info('Generating:', now.toLocaleString(), '|', now.toString());
  console.log();

  // Aggregates
  const craftlandData = await getCraftlandAggregate();

  // Craftland JSON
  writeJSONToOutput('craftland.json', { ...craftlandData });

  // shields JSON
  writeJSONToOutput('shields.craftland.likes.json', {
    schemaVersion: 1,
    label: 'Craftland Likes',
    message: thousands(craftlandData.likesTotal), // Craftland likes
    cacheSeconds: 3600
  });

  writeJSONToOutput('shields.craftland.stars.json', {
    schemaVersion: 1,
    label: 'Craftland Stars',
    message: thousands(craftlandData.starsTotal), // Craftland stars
    cacheSeconds: 3600
  });

  console.log();
  console.info('All generation has been completed.');
  process.exit(0);
} catch (error) {
  console.error('Generate JSON error!', error);
  process.exit(1);
}

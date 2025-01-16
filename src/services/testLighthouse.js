import { fetchPageSpeedDataForURLs } from './api.js';

(async () => {
  const testURLs = [
    'https://www.google.com',
    'https://www.wikipedia.org',
    'https://www.github.com'
  ];

  console.log('Running Lighthouse for test URLs...');
  const results = await fetchPageSpeedDataForURLs(testURLs);
  console.log('Results:', results);
})();

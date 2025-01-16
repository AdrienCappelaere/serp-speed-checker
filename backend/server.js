import express from 'express';
import cors from 'cors'; // Import CORS middleware
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import lighthouse from 'lighthouse';
import pLimit from 'p-limit';

puppeteer.use(StealthPlugin());

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(express.json());

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

async function runLighthouse(url) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        let browser;
        try {
            console.log(`Processing URL: ${url} (Attempt ${attempt})`);
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-background-networking',
                    '--disable-default-apps',
                    '--disable-extensions',
                    '--disable-sync',
                    '--disable-translate',
                    '--metrics-recording-only',
                    '--mute-audio',
                ],
            });

            const { port } = new URL(browser.wsEndpoint());
            const options = {
                port,
                output: 'json',
                onlyCategories: ['performance'],
                throttlingMethod: 'provided',
                disableStorageReset: true,
            };

            const runnerResult = await lighthouse(url, options);
            const performanceScore = runnerResult.lhr.categories.performance.score;

            return { url, performanceScore };
        } catch (error) {
            console.error(`Error processing ${url} on attempt ${attempt}: ${error.message}`);
            if (attempt === 3) {
                return { url, error: `Failed after 3 attempts: ${error.message}` };
            }
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

app.post('/fetch-page-speed', async (req, res) => {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid input. "urls" must be an array.' });
    }

    const validUrls = urls.filter(isValidUrl);
    if (validUrls.length === 0) {
        return res.status(400).json({ error: 'No valid URLs provided.' });
    }

    const limit = pLimit(2);

    try {
        const results = await Promise.all(validUrls.map((url) => limit(() => runLighthouse(url))));
        res.json(results);
    } catch (error) {
        console.error('Error running Lighthouse:', error.message);
        res.status(500).json({ error: 'Failed to process URLs.' });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Lighthouse server running at http://localhost:${PORT}`);
});

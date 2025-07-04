const puppeteer = require('puppeteer-extra');
const puppeteerCore = require('puppeteer-core');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function fetchTrackingData(barcode) {
  const mainUrl = 'https://egyptpost.gov.eg/ar-eg/home/eservices/track-and-trace/';
  
  // Configure Puppeteer for different environments
  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection'
    ]
  };

  // Try to use system Chrome if available
  const possibleChromePaths = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];

  for (const chromePath of possibleChromePaths) {
    if (chromePath) {
      try {
        const fs = require('fs');
        if (fs.existsSync(chromePath)) {
          launchOptions.executablePath = chromePath;
          console.log(`Using Chrome at: ${chromePath}`);
          break;
        }
      } catch (error) {
        console.log(`Chrome not found at: ${chromePath}`);
      }
    }
  }

  // If no system Chrome found, let Puppeteer use its bundled version
  if (!launchOptions.executablePath) {
    console.log('No system Chrome found, using Puppeteer bundled Chrome');
  }
  
  const browser = await puppeteer.launch(launchOptions);
  
  const page = await browser.newPage();

  await page.goto(mainUrl, { waitUntil: 'networkidle2' });

  // انتظر حتى يظهر حقل الإدخال ثم اكتب فيه
  await page.waitForSelector('input.input0', { timeout: 15000 });
  await page.type('input.input0', barcode, { delay: 100 });

  // اضغط زر تتبع شحنتك (وهو <a class="custBtn">)
  await page.waitForSelector('a.custBtn');
  await page.click('a.custBtn');

  // انتظر 4 ثواني (بديل لـ page.waitForTimeout)
  await new Promise(resolve => setTimeout(resolve, 4000));

  // الآن نفذ طلب الـ API من داخل الصفحة
  const apiUrl = `https://egyptpost.gov.eg/ar-EG/TrackTrace/GetShipmentDetails?barcode=${barcode}`;
  const data = await page.evaluate(async (apiUrl) => {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'ar,en-US;q=0.9,en;q=0.8',
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { error: 'لم يتمكن من قراءة البيانات', raw: text };
    }
  }, apiUrl);

  await browser.close();
  return data;
}

module.exports = fetchTrackingData; 
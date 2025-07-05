const puppeteer = require('puppeteer-extra');
const puppeteerCore = require('puppeteer-core');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function fetchTrackingData(barcode) {
  const mainUrl = 'https://egyptpost.gov.eg/ar-eg/home/eservices/track-and-trace/';
  
  try {
    console.log(`Starting Puppeteer for barcode: ${barcode}`);
    
    // Configure Puppeteer for Render environment with Chrome installation
    const launchOptions = {
      headless: true,
      executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome-stable',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--memory-pressure-off',
        '--max_old_space_size=4096',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      timeout: 60000
    };

    console.log(`Using Chrome at: ${launchOptions.executablePath}`);
    
    const browser = await puppeteer.launch(launchOptions);
    
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Navigating to Egypt Post...');
    await page.goto(mainUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('Waiting for input field...');
    // انتظر حتى يظهر حقل الإدخال ثم اكتب فيه
    await page.waitForSelector('input.input0', { timeout: 15000 });
    await page.type('input.input0', barcode, { delay: 100 });

    console.log('Clicking track button...');
    // اضغط زر تتبع شحنتك (وهو <a class="custBtn">)
    await page.waitForSelector('a.custBtn');
    await page.click('a.custBtn');

    console.log('Waiting for API response...');
    // انتظر 4 ثواني (بديل لـ page.waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 4000));

    // الآن نفذ طلب الـ API من داخل الصفحة
    const apiUrl = `https://egyptpost.gov.eg/ar-EG/TrackTrace/GetShipmentDetails?barcode=${barcode}`;
    console.log('Making API request...');
    
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

    console.log('Closing browser...');
    await browser.close();
    
    console.log('Puppeteer completed successfully');
    return data;
    
  } catch (error) {
    console.error('Puppeteer error:', error.message);
    
    // Return a structured error response
    return {
      success: false,
      error: 'Puppeteer initialization failed',
      message: error.message,
      details: {
        type: 'puppeteer_error',
        barcode: barcode,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = fetchTrackingData; 
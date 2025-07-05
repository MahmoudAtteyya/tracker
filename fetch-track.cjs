const fetch = require('node-fetch');

async function fetchTrackingData(barcode) {
  try {
    console.log(`Fetching tracking data for barcode: ${barcode} (via direct fetch)`);
    
    // Direct API call to Egypt Post
    const apiUrl = `https://egyptpost.gov.eg/ar-EG/TrackTrace/GetShipmentDetails?barcode=${barcode}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://egyptpost.gov.eg/ar-eg/home/eservices/track-and-trace/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      timeout: 30000
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log(`Response length: ${text.length} characters`);

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.log('Failed to parse JSON, returning raw response');
      return {
        success: false,
        error: 'Invalid JSON response',
        raw: text.substring(0, 500)
      };
    }

  } catch (error) {
    console.error('Fetch error:', error.message);
    return {
      success: false,
      error: 'Fetch failed',
      message: error.message,
      details: {
        type: 'fetch_error',
        barcode: barcode,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = fetchTrackingData; 
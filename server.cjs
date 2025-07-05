const express = require('express');
const cors = require('cors');
const path = require('path');
const fetchTrackingData = require('./puppeteer-track.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for Egypt Post API
app.get('/api/track/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    if (!barcode) {
      return res.status(400).json({ success: false, error: 'Barcode is required' });
    }

    console.log(`Fetching tracking data for barcode: ${barcode} (via Puppeteer)`);

    const data = await fetchTrackingData(barcode);

    // Check if it's a Puppeteer error
    if (data && data.error === 'Puppeteer initialization failed') {
      console.error('Puppeteer failed:', data.message);
      return res.status(500).json({
        success: false,
        error: 'Puppeteer initialization failed',
        message: data.message,
        details: data.details
      });
    }

    if (data && data.success) {
      res.json(data);
    } else {
      res.status(404).json({ success: false, error: 'No data found', data });
    }
  } catch (error) {
    console.error(`Error fetching tracking data for ${req.params.barcode}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracking data (Puppeteer)',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📦 Egypt Post API proxy: http://localhost:${PORT}/api/track/:barcode`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
}); 
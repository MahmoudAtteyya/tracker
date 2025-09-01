const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for external tracking server
app.get('/api/track/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    if (!barcode) {
      return res.status(400).json({ success: false, error: 'Barcode is required' });
    }

    console.log(`Proxying request for barcode: ${barcode}`);

    const response = await fetch(`http://13.62.63.200:3000/track/${barcode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(`Error proxying request for ${req.params.barcode}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracking data',
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
  console.log(`📦 External API proxy: http://localhost:${PORT}/api/track/:barcode`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
}); 

const express = require('express');
const cors = require('cors');
const path = require('path');
const APIManager = require('./api-manager.cjs');

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize API Manager
const apiManager = new APIManager();

// Server startup time
const serverStartTime = Date.now();

// Keep-Alive system for Render free tier
let keepAliveInterval;

// Function to get memory usage
function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    used: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
    total: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
    percentage: Math.round((usage.rss / usage.heapTotal) * 100),
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100, // MB
    arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024 * 100) / 100 // MB
  };
}

// Function to get system information
function getSystemInfo() {
  const cpuUsage = process.cpuUsage();
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    pid: process.pid,
    cpuUsage: {
      user: Math.round(cpuUsage.user / 1000), // Convert to milliseconds
      system: Math.round(cpuUsage.system / 1000)
    }
  };
}

// Function to get uptime in Arabic format
function getUptimeInArabic() {
  const uptimeMs = Date.now() - serverStartTime;
  const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
  
  return `${hours}س ${minutes}د ${seconds}ث`;
}

// Self-ping function for keep-alive
async function selfPing() {
  try {
    // Use dynamic import for node-fetch in Node.js environment
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`http://localhost:${PORT}/api/health/ping`);
    if (response.ok) {
      console.log('🔄 Keep-Alive ping successful');
    }
  } catch (error) {
    console.log('⚠️ Keep-Alive ping failed:', error.message);
  }
}

// Initialize Keep-Alive system
function initializeKeepAlive() {
  // Self-ping every 10 minutes (600000ms)
  keepAliveInterval = setInterval(selfPing, 10 * 60 * 1000);
  console.log('🔄 Keep-Alive system initialized (10-minute intervals)');
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for external tracking server with failover
app.get('/api/track/:barcode', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { barcode } = req.params;
    if (!barcode) {
      return res.status(400).json({ success: false, error: 'Barcode is required' });
    }

    console.log(`📦 [Proxy] Starting tracking request for barcode: ${barcode}`);
    console.log(`🎯 [Proxy] Current API: ${apiManager.getCurrentAPI().name}`);

    // Use API Manager to make request with automatic failover
    const data = await apiManager.makeRequest(barcode);
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ [Proxy] Request completed successfully in ${responseTime}ms via ${apiManager.getCurrentAPI().name}`);
    
    res.json(data);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`💥 [Proxy] Request failed after ${responseTime}ms for ${req.params.barcode}:`, error.message);
    
    // Log current API status for debugging
    const status = apiManager.getStatus();
    console.log(`📊 [Proxy] API Status Summary:`);
    status.apis.forEach(api => {
      console.log(`  - ${api.name}: ${api.isAvailable ? '✅ Available' : '❌ Unavailable'} (failures: ${api.failureCount})`);
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracking data from all available sources',
      message: error.message,
      details: 'All tracking APIs are currently experiencing issues. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Keep-Alive ping endpoint
app.get('/api/health/ping', (req, res) => {
  res.json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: getUptimeInArabic(),
    memory: getMemoryUsage()
  });
});

// Server status endpoint with Arabic interface
app.get('/api/server/status', (req, res) => {
  const memory = getMemoryUsage();
  const systemInfo = getSystemInfo();
  const apiStatus = apiManager.getStatus();
  
  res.json({
    status: {
      ar: 'يعمل بشكل طبيعي',
      en: 'running normally'
    },
    message: {
      ar: 'Elliaa Forms Server is running! 🚀',
      en: 'Elliaa Forms Server is running! 🚀'
    },
    uptime: {
      ar: getUptimeInArabic(),
      en: Math.floor((Date.now() - serverStartTime) / 1000) + ' seconds',
      milliseconds: Date.now() - serverStartTime
    },
    environment: process.env.NODE_ENV || 'production',
    memory: {
      used: memory.used,
      total: memory.total,
      percentage: memory.percentage,
      heapUsed: memory.heapUsed,
      external: memory.external,
      arrayBuffers: memory.arrayBuffers,
      unit: 'MB'
    },
    system: {
      platform: systemInfo.platform,
      arch: systemInfo.arch,
      nodeVersion: systemInfo.nodeVersion,
      pid: systemInfo.pid,
      cpuUsage: systemInfo.cpuUsage
    },
    lastUpdate: new Date().toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    endpoints: [
      '/health/ping',
      '/api/track/:barcode',
      '/api/status',
      '/api/server/status'
    ],
    keepAlive: {
      active: !!keepAliveInterval,
      interval: '10 minutes',
      description: {
        ar: 'نظام Keep-Alive يمنع نوم الخادم على الخطة المجانية من Render',
        en: 'Keep-Alive system prevents server sleep on Render free tier'
      },
      features: [
        'تحديث تلقائي كل 30 ثانية',
        'مراقبة استخدام الذاكرة',
        'متوافق مع خدمات Cron الخارجية'
      ]
    },
    apis: {
      total: apiStatus.apis.length,
      available: apiStatus.apis.filter(api => api.isAvailable).length,
      current: apiStatus.currentAPI.name
    }
  });
});

// API status endpoint for monitoring
app.get('/api/status', (req, res) => {
  const status = apiManager.getStatus();
  res.json({
    timestamp: new Date().toISOString(),
    currentAPI: {
      name: status.currentAPI.name,
      url: status.currentAPI.url,
      priority: status.currentAPI.priority
    },
    apis: status.apis.map(api => ({
      id: api.id,
      name: api.name,
      url: api.url,
      priority: api.priority,
      isActive: api.isActive,
      isAvailable: api.isAvailable,
      failureCount: api.failureCount,
      lastSuccess: api.lastSuccess ? new Date(api.lastSuccess).toISOString() : null,
      lastFailure: api.lastFailure ? new Date(api.lastFailure).toISOString() : null,
      cooldownRemaining: api.cooldownRemaining
    }))
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📦 External API proxy: http://localhost:${PORT}/api/track/:barcode`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📊 API Status endpoint: http://localhost:${PORT}/api/status`);
  console.log(`🏥 Server Status endpoint: http://localhost:${PORT}/api/server/status`);
  console.log(`💓 Health Check endpoint: http://localhost:${PORT}/api/health/ping`);
  console.log(`💡 Initialized with API failover system:`);
  
  const status = apiManager.getStatus();
  status.apis.forEach(api => {
    console.log(`  - ${api.name} (Priority ${api.priority}): ${api.url}`);
  });
  console.log(`🎯 Current active API: ${status.currentAPI.name}`);
  
  // Initialize Keep-Alive system
  initializeKeepAlive();
}); 

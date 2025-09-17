# API Failover System Documentation

## Overview

This application now includes a professional API failover system that automatically switches between primary and fallback tracking APIs to ensure maximum uptime and reliability.

## APIs Configuration

### Primary API
- **URL**: `http://13.62.63.200:3000/track`
- **Priority**: 1 (Highest)
- **Role**: Main tracking API

### Fallback API
- **URL**: `http://16.16.250.40:3000/track`
- **Priority**: 2
- **Role**: Backup tracking API

## How It Works

### 1. Automatic Failover
- The system automatically detects when an API is failing
- After 3 consecutive failures, an API is marked as unavailable
- The system automatically switches to the next available API
- Failed APIs are put in a 5-minute cooldown period

### 2. Health Monitoring
- Periodic health checks every 2 minutes
- Automatic recovery detection for failed APIs
- Smart switching back to primary API when it recovers

### 3. Request Flow
1. **Primary First**: Always tries primary API first
2. **Automatic Switch**: If primary fails, switches to fallback
3. **Smart Recovery**: Automatically switches back to primary when it recovers
4. **Comprehensive Logging**: All switches and failures are logged

## Logging Features

### Console Logs (Visible in Render)
- **API Switches**: Clear messages when switching between APIs
- **Success/Failure Tracking**: Detailed logs for each request
- **Health Check Results**: Periodic health check outcomes
- **Recovery Notifications**: Alerts when APIs come back online

### Log Examples
```
🔄 [API Manager] Switching from Primary API (http://13.62.63.200:3000/track) to Fallback API (http://16.16.250.40:3000/track)
✅ [API Manager] Request successful via Fallback API
🎉 [Health Check] Primary API is back online! Resetting failure count.
🔄 [Health Check] Switched back to Primary API (primary API)
```

## Monitoring Endpoints

### API Status Endpoint
**GET** `/api/status`

Returns comprehensive status of all APIs:
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "currentAPI": {
    "name": "Primary API",
    "url": "http://13.62.63.200:3000/track",
    "priority": 1
  },
  "apis": [
    {
      "id": "primary",
      "name": "Primary API",
      "url": "http://13.62.63.200:3000/track",
      "priority": 1,
      "isActive": true,
      "isAvailable": true,
      "failureCount": 0,
      "lastSuccess": "2024-01-01T11:59:30.000Z",
      "lastFailure": null,
      "cooldownRemaining": 0
    },
    {
      "id": "fallback",
      "name": "Fallback API",
      "url": "http://16.16.250.40:3000/track",
      "priority": 2,
      "isActive": true,
      "isAvailable": true,
      "failureCount": 0,
      "lastSuccess": "2024-01-01T11:58:15.000Z",
      "lastFailure": null,
      "cooldownRemaining": 0
    }
  ]
}
```

## Configuration Parameters

### Timing Settings
- **Request Timeout**: 30 seconds
- **Failure Threshold**: 3 consecutive failures
- **Cooldown Period**: 5 minutes
- **Health Check Interval**: 2 minutes
- **Health Check Timeout**: 10 seconds

### Failure Handling
- **Automatic Retry**: Built-in retry logic for network errors
- **Exponential Backoff**: Smart delay between retries
- **Graceful Degradation**: Continues with available APIs

## Benefits

### 1. High Availability
- **99%+ Uptime**: Multiple API sources ensure service continuity
- **Automatic Recovery**: No manual intervention required
- **Zero Downtime Switching**: Seamless transitions between APIs

### 2. Performance Optimization
- **Smart Routing**: Always uses the best available API
- **Fast Failure Detection**: Quick identification of problematic APIs
- **Efficient Recovery**: Automatic return to primary API

### 3. Monitoring & Debugging
- **Comprehensive Logging**: Full visibility into API operations
- **Status Monitoring**: Real-time API health information
- **Failure Analysis**: Detailed error tracking and reporting

## Deployment Notes

### Render Deployment
- All logs are visible in Render's log viewer
- API switches are clearly marked with emojis for easy identification
- Status endpoint can be used for external monitoring

### Environment Variables
No additional environment variables are required. The system works out of the box.

## Troubleshooting

### Common Scenarios

1. **Primary API Down**
   - System automatically switches to fallback
   - Logs: `🔄 [API Manager] Switching from Primary API to Fallback API`

2. **Both APIs Down**
   - System returns appropriate error message
   - Logs: `💥 [API Manager] All available APIs failed`

3. **Primary API Recovery**
   - System automatically switches back to primary
   - Logs: `🎉 [Health Check] Primary API is back online!`

### Monitoring Commands
```bash
# Check API status
curl https://your-app.onrender.com/api/status

# Check server health
curl https://your-app.onrender.com/api/health
```

## Future Enhancements

- **Load Balancing**: Distribute requests across multiple healthy APIs
- **Geographic Routing**: Route to closest API based on user location
- **Custom Retry Policies**: Configurable retry strategies per API
- **Metrics Dashboard**: Web-based monitoring interface

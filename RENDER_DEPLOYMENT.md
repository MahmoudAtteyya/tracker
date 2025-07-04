# Render Deployment Guide

## Environment Setup

### Build Command
```bash
chmod +x install-chrome.sh && ./install-chrome.sh && npm install && npm run build
```

### Start Command
```bash
npm start
```

### Environment Variables
- `PORT`: Set to 10000 (or let Render auto-assign)
- `CHROME_BIN`: Set to `/usr/bin/google-chrome-stable`

## Render Configuration

1. **Build Command**: `chmod +x install-chrome.sh && ./install-chrome.sh && npm install && npm run build`
2. **Start Command**: `npm start`
3. **Environment**: Node.js
4. **Region**: Choose closest to your users

## Environment Variables in Render Dashboard

Add these environment variables in your Render service settings:

- `CHROME_BIN` = `/usr/bin/google-chrome-stable`
- `NODE_ENV` = `production`

## Troubleshooting

If you encounter Chrome-related errors:

1. Make sure the `install-chrome.sh` script is executable
2. Verify that `CHROME_BIN` environment variable is set correctly
3. Check that the build command installs Chrome before building the app

## Alternative Approach

If Chrome installation fails, the app will fall back to using Puppeteer's bundled Chrome (if available) or provide a clear error message. 
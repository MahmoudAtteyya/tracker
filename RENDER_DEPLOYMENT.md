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

## How it works

The app now uses the standard `puppeteer` package which includes a bundled Chrome browser, eliminating the need to install Chrome separately in the Render environment.

## Troubleshooting

If you encounter any issues:

1. Check the build logs for any npm install errors
2. Verify that the start command is `npm start`
3. Make sure all dependencies are properly installed

The app should now work without requiring Chrome installation scripts. 
# Render Deployment Guide

## Environment Setup

### Build Command
```bash
npm install && npm run build
```

### Start Command
```bash
npm start
```

### Environment Variables
- `PORT`: Set to 10000 (or let Render auto-assign)

## Render Configuration

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Environment**: Node.js
4. **Region**: Choose closest to your users

## Environment Variables in Render Dashboard

Add these environment variables in your Render service settings:

- `NODE_ENV` = `production`

## How it works

The app now uses an external tracking server at `http://51.20.44.4:3000/track/` to fetch shipment data, eliminating the need for Puppeteer and Chrome installation in the Render environment.

## API Endpoint

The app connects to: `http://51.20.44.4:3000/track/{barcode}`

Example: `http://51.20.44.4:3000/track/ENO31557487EG`

## Troubleshooting

If you encounter any issues:

1. Check that the external tracking server is running
2. Verify network connectivity to `51.20.44.4:3000`
3. Check the browser console for any CORS or network errors

The app should now work without requiring Puppeteer or Chrome installation. 
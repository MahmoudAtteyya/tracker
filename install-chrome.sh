#!/bin/bash

echo "Installing Chrome for Puppeteer..."

# Update package list
apt-get update

# Install dependencies
apt-get install -y wget gnupg ca-certificates

# Add Google Chrome repository
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Update package list again
apt-get update

# Install Google Chrome
apt-get install -y google-chrome-stable

# Set environment variable
export CHROME_BIN=/usr/bin/google-chrome-stable

echo "Chrome installation completed!"
echo "Chrome binary location: $CHROME_BIN"

# Verify installation
if [ -f "$CHROME_BIN" ]; then
    echo "Chrome is successfully installed!"
    $CHROME_BIN --version
else
    echo "Chrome installation failed!"
    exit 1
fi 
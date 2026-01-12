const fetch = require('node-fetch');

class APIManager {
  constructor() {
    this.apis = [
      {
        id: 'primary',
        name: 'Tracking API',
        url: 'https://egyptpost.elliaa.com/track',
        isActive: true,
        failureCount: 0,
        lastFailure: null,
        lastSuccess: null,
        priority: 1
      }
    ];

    this.currentApiIndex = 0;
    this.maxRetries = 3;
    this.failureThreshold = 3;
    this.cooldownPeriod = 5 * 60 * 1000; // 5 minutes
    this.requestTimeout = 30000; // 30 seconds
    this.healthCheckInterval = 2 * 60 * 1000; // 2 minutes

    // Start periodic health checks
    this.startHealthChecks();
  }

  /**
   * Get the currently active API
   */
  getCurrentAPI() {
    return this.apis[this.currentApiIndex];
  }

  /**
   * Get all available APIs sorted by priority
   */
  getAvailableAPIs() {
    return this.apis
      .filter(api => this.isAPIAvailable(api))
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if an API is available (not in cooldown)
   */
  isAPIAvailable(api) {
    if (!api.isActive) return false;

    const now = Date.now();
    const isInCooldown = api.lastFailure &&
      (now - api.lastFailure) < this.cooldownPeriod &&
      api.failureCount >= this.failureThreshold;

    return !isInCooldown;
  }

  /**
   * Switch to the next available API
   */
  switchToNextAPI() {
    const availableAPIs = this.getAvailableAPIs();

    if (availableAPIs.length === 0) {
      console.log('⚠️  [API Manager] No available APIs found, using current API');
      return false;
    }

    const currentAPI = this.getCurrentAPI();
    const nextAPI = availableAPIs.find(api => api.id !== currentAPI.id) || availableAPIs[0];

    if (nextAPI.id !== currentAPI.id) {
      const previousIndex = this.currentApiIndex;
      this.currentApiIndex = this.apis.findIndex(api => api.id === nextAPI.id);

      console.log(`🔄 [API Manager] Switching from ${this.apis[previousIndex].name} (${this.apis[previousIndex].url}) to ${nextAPI.name} (${nextAPI.url})`);
      console.log(`📊 [API Manager] Previous API failure count: ${this.apis[previousIndex].failureCount}`);

      return true;
    }

    return false;
  }

  /**
   * Record API success
   */
  recordSuccess(apiId) {
    const api = this.apis.find(a => a.id === apiId);
    if (api) {
      api.lastSuccess = Date.now();
      api.failureCount = 0; // Reset failure count on success
      console.log(`✅ [API Manager] ${api.name} request successful - failure count reset`);
    }
  }

  /**
   * Record API failure
   */
  recordFailure(apiId, error) {
    const api = this.apis.find(a => a.id === apiId);
    if (api) {
      api.lastFailure = Date.now();
      api.failureCount++;
      console.log(`❌ [API Manager] ${api.name} failed (attempt ${api.failureCount}/${this.failureThreshold}): ${error.message}`);

      if (api.failureCount >= this.failureThreshold) {
        console.log(`🚫 [API Manager] ${api.name} marked as unavailable for ${this.cooldownPeriod / 1000}s due to repeated failures`);
      }
    }
  }

  /**
   * Perform health check on an API
   */
  async performHealthCheck(api) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for health check

      const response = await fetch(`${api.url}/health-check-dummy`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // For health check, we just need to see if the server responds
      // Even a 404 is better than no response at all
      if (response.status < 500) {
        this.recordSuccess(api.id);
        return true;
      }

      throw new Error(`Server error: ${response.status}`);

    } catch (error) {
      // Don't record failure for health checks, just log
      console.log(`🔍 [Health Check] ${api.name} health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Start periodic health checks
   */
  startHealthChecks() {
    setInterval(async () => {
      console.log('🔍 [Health Check] Starting periodic API health checks...');

      for (const api of this.apis) {
        if (!this.isAPIAvailable(api) && api.failureCount >= this.failureThreshold) {
          console.log(`🔍 [Health Check] Checking ${api.name} for recovery...`);
          const isHealthy = await this.performHealthCheck(api);

          if (isHealthy) {
            console.log(`🎉 [Health Check] ${api.name} is back online! Resetting failure count.`);
            api.failureCount = 0;
            api.lastFailure = null;

            // If this is the primary API and we're currently using fallback, switch back
            if (api.priority === 1 && this.currentApiIndex !== 0) {
              this.currentApiIndex = 0;
              console.log(`🔄 [Health Check] Switched back to ${api.name} (primary API)`);
            }
          }
        }
      }
    }, this.healthCheckInterval);
  }

  /**
   * Make a request with automatic failover
   */
  async makeRequest(barcode) {
    let lastError = null;
    const availableAPIs = this.getAvailableAPIs();

    if (availableAPIs.length === 0) {
      throw new Error('No available APIs for tracking request');
    }

    // Always try current API first, then try others
    const apisToTry = [this.getCurrentAPI(), ...availableAPIs.filter(api => api.id !== this.getCurrentAPI().id)];

    for (let i = 0; i < apisToTry.length; i++) {
      const api = apisToTry[i];

      if (!this.isAPIAvailable(api)) {
        console.log(`⏭️  [API Manager] Skipping ${api.name} - currently unavailable`);
        continue;
      }

      console.log(`🔍 [API Manager] Attempting request to ${api.name} (${api.url}/${barcode})`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        console.log(`🔍 [API Manager] Fetching URL: ${api.url}/${barcode}`);

        const response = await fetch(`${api.url}/${barcode}`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Log response details for debugging
        console.log(`📡 [API Manager] Response status: ${response.status} ${response.statusText}`);
        console.log(`📡 [API Manager] Response headers:`, JSON.stringify(Object.fromEntries(response.headers.entries())));

        if (!response.ok) {
          // Try to get error details from response body
          let errorBody = '';
          try {
            errorBody = await response.text();
            console.log(`📡 [API Manager] Error response body:`, errorBody.substring(0, 500));
          } catch (e) {
            console.log(`📡 [API Manager] Could not read error body:`, e.message);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Record success
        this.recordSuccess(api.id);

        // Switch to this API if it's not current and has higher priority
        if (api.id !== this.getCurrentAPI().id && api.priority < this.getCurrentAPI().priority) {
          this.currentApiIndex = this.apis.findIndex(a => a.id === api.id);
          console.log(`🔄 [API Manager] Switched to higher priority API: ${api.name}`);
        }

        console.log(`✅ [API Manager] Request successful via ${api.name}`);
        return data;

      } catch (error) {
        lastError = error;
        this.recordFailure(api.id, error);

        // If this was the current API and it failed, try to switch
        if (api.id === this.getCurrentAPI().id) {
          const switched = this.switchToNextAPI();
          if (switched) {
            console.log(`🔄 [API Manager] Automatically switched due to failure`);
          }
        }

        console.log(`❌ [API Manager] Request failed via ${api.name}: ${error.message}`);

        // Continue to next API
        continue;
      }
    }

    // If we get here, all APIs failed
    console.log(`💥 [API Manager] All available APIs failed for barcode: ${barcode}`);
    throw lastError || new Error('All tracking APIs are currently unavailable');
  }

  /**
   * Get current status of all APIs
   */
  getStatus() {
    return {
      currentAPI: this.getCurrentAPI(),
      apis: this.apis.map(api => ({
        ...api,
        isAvailable: this.isAPIAvailable(api),
        cooldownRemaining: api.lastFailure ?
          Math.max(0, this.cooldownPeriod - (Date.now() - api.lastFailure)) : 0
      }))
    };
  }
}

module.exports = APIManager;

import { useEffect, useRef, useState } from 'react';

interface KeepAliveOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  endpoint?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (isActive: boolean) => void;
}

interface KeepAliveStatus {
  isActive: boolean;
  lastPing: Date | null;
  successCount: number;
  errorCount: number;
  lastError: string | null;
}

export const useKeepAlive = (options: KeepAliveOptions = {}) => {
  const {
    enabled = true,
    interval = 10 * 60 * 1000, // 10 minutes default
    endpoint = '/api/health/ping',
    onSuccess,
    onError,
    onStatusChange
  } = options;

  const [status, setStatus] = useState<KeepAliveStatus>({
    isActive: false,
    lastPing: null,
    successCount: 0,
    errorCount: 0,
    lastError: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const ping = async (): Promise<void> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setStatus(prev => ({
        ...prev,
        lastPing: new Date(),
        successCount: prev.successCount + 1,
        lastError: null
      }));

      onSuccess?.(data);
      console.log('🔄 Keep-Alive ping successful:', data);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was aborted, don't treat as error
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setStatus(prev => ({
        ...prev,
        lastPing: new Date(),
        errorCount: prev.errorCount + 1,
        lastError: errorMessage
      }));

      onError?.(error instanceof Error ? error : new Error(errorMessage));
      console.error('⚠️ Keep-Alive ping failed:', errorMessage);
    }
  };

  const start = (): void => {
    if (intervalRef.current) {
      return; // Already running
    }

    setStatus(prev => ({ ...prev, isActive: true }));
    onStatusChange?.(true);

    // Initial ping
    ping();

    // Set up interval
    intervalRef.current = setInterval(ping, interval);
    console.log(`🔄 Keep-Alive started with ${interval / 1000}s interval`);
  };

  const stop = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setStatus(prev => ({ ...prev, isActive: false }));
    onStatusChange?.(false);
    console.log('⏹️ Keep-Alive stopped');
  };

  const restart = (): void => {
    stop();
    setTimeout(start, 1000); // Small delay before restart
  };

  // Auto-start/stop based on enabled option
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [enabled, interval, endpoint]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    status,
    start,
    stop,
    restart,
    ping
  };
};

export default useKeepAlive;

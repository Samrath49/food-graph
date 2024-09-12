import { useState, useCallback, useRef, useEffect } from "react";
import { endpoints } from "../api/endpoints";
import { ApiResponse, CacheItem } from "@/types";

function useMealApi<T>(cacheTime: number = 5 * 60 * 1000) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const cacheRef = useRef<Map<string, CacheItem<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestRef = useRef<Promise<T | null> | null>(null);

  const fetchData = useCallback(
    async (endpointKey: string, params: string = ""): Promise<T | null> => {
      const endpoint = endpoints.get(endpointKey);
      if (!endpoint) {
        throw new Error(`Invalid endpoint key: ${endpointKey}`);
      }

      const url = `${endpoint}${params}`;
      const cacheKey = url;
      const cachedItem = cacheRef.current.get(cacheKey);

      if (cachedItem && Date.now() - cachedItem.timestamp < cacheTime) {
        // Use cached data if it's still valid
        setState({ data: cachedItem.data, loading: false, error: null });
        return cachedItem.data;
      }

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Set up new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Mark active request for future reference
        const fetchPromise = fetch(url, {
          method: "GET",
          signal: abortController.signal,
        });

        activeRequestRef.current = fetchPromise as Promise<T | null>;

        const response = await fetchPromise;

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });

        // Cache the fetched data
        cacheRef.current.set(cacheKey, { data, timestamp: Date.now() });

        return data;
      } catch (error) {
        // Handle abort and other errors
        if (error instanceof Error && error.name === "AbortError") {
          return null;
        }
        setState({ data: null, loading: false, error: error as Error });
        return null;
      } finally {
        // Reset abort controller and active request
        abortControllerRef.current = null;
        activeRequestRef.current = null;
      }
    },
    [cacheTime]
  );

  useEffect(() => {
    // Cleanup any pending requests when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { ...state, fetchData };
}

export default useMealApi;

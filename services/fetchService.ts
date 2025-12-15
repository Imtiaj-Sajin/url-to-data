import { FetchResult } from '../types';

export const fetchUrlSource = async (url: string): Promise<FetchResult> => {
  // Normalize URL: Ensure it starts with http:// or https://
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  // Strategy Pattern: List of proxies to try in order.
  // If one fails (500, 403, CORS error), we try the next.
  const strategies = [
    {
      name: 'CorsProxy.io',
      getUrl: (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`
    },
    {
      name: 'AllOrigins',
      getUrl: (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}&timestamp=${new Date().getTime()}`
    },
    {
      name: 'CodeTabs',
      getUrl: (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`
    }
  ];

  let lastError: Error | null = null;

  for (const strategy of strategies) {
    try {
      const proxyUrl = strategy.getUrl(targetUrl);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Proxy ${strategy.name} responded with status: ${response.status}`);
      }

      const content = await response.text();

      if (!content || content.trim().length === 0) {
        throw new Error(`Proxy ${strategy.name} returned empty content`);
      }

      // If we got here, we succeeded
      return {
        url: targetUrl,
        content,
        success: true,
      };

    } catch (error: any) {
      console.warn(`Attempt with ${strategy.name} failed:`, error.message);
      lastError = error;
      // Continue to the next strategy in the loop
    }
  }

  // If loop finishes without returning, all proxies failed
  return {
    url: targetUrl,
    content: '',
    success: false,
    error: `Unable to fetch source. The site may be blocking access or all proxies are busy. (Last error: ${lastError?.message || 'Unknown'})`,
  };
};
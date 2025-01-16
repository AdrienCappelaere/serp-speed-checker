export function getDomainFromUrl(fullUrl) {
    try {
      const url = new URL(fullUrl);
      // Remove subdomains and extract just the domain (e.g., adriseo.com)
      return url.hostname.replace(/^www\./, '');
    } catch (error) {
      console.error('Invalid URL:', fullUrl);
      throw new Error('Invalid URL provided');
    }
  }
  
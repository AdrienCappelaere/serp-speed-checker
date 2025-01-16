import axios from 'axios';

export async function fetchSERPData({ keyword, language_name, location_code, target }) {
    try {
      const response = await axios.post('http://localhost:3001/proxy/dataforseo', {
        keyword,
        language_name,
        location_code,
        target,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching SERP data:', error.response?.data || error.message);
      throw new Error('Failed to fetch SERP data');
    }
  }

export async function fetchPageSpeedData(url) {
    const urlApi = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  
    // Ensure the URL has the correct protocol
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  
    try {
      const response = await axios.get(urlApi, {
        params: {
          url: formattedUrl,
          strategy: 'mobile', // You can also use 'mobile' if needed
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching PageSpeed data:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch PageSpeed data');
    }
  }


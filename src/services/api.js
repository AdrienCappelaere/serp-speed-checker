import axios from 'axios';

export async function fetchSERPData({ keyword, language_name, location_name }) {
  try {
    const response = await axios.post('http://localhost:3001/proxy/dataforseo', {
      keyword,
      language_name,
      location_name,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching SERP data:', error.response?.data || error.message);
    throw new Error('Failed to fetch SERP data');
  }
}

// Updated function to fetch performance data
export const fetchPageSpeedDataForURLs = async (urls) => {
  try {
    // Send a request to your backend server to fetch Lighthouse scores
    const response = await axios.post('http://localhost:3002/fetch-page-speed', { urls });
    return response.data;
  } catch (error) {
    console.error('Error fetching PageSpeed data:', error.response?.data || error.message);
    throw new Error('Failed to fetch PageSpeed data');
  }
};

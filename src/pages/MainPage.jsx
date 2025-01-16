import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fetchSERPData, fetchPageSpeedData } from '@/services/api';
import { getDomainFromUrl } from '@/utils/urlUtils';

function MainPage() {
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!keyword || !language || !location || !url) {
      alert('Please fill in all fields.');
      return;
    }
  
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('Please enter a valid URL with http:// or https://');
      return;
    }
    
  
    setLoading(true);
  
    try {

      const domain = getDomainFromUrl(url);

      const serpData = await fetchSERPData({
        keyword,
        language_name: language,
        location_code: location,
        target: domain });
      const pageSpeedData = await fetchPageSpeedData(url);
  
      setResults({
        keyword,
        language,
        location,
        fullURL: url,
        serpData,
        pageSpeedData,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">SERP Speed Checker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Keyword</label>
          <Input
            placeholder="Enter a keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">URL</label>
          <Input
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Location</label>
          <Input
            placeholder="Enter a location (e.g., US)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Language</label>
          <Input
            placeholder="Enter a language (e.g., English)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Checking...' : 'Submit'}
        </Button>
      </form>
      {results && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Results</h3>
          <p className="mb-2">Keyword: {results.keyword}</p>
          <p className="mb-2">URL: {results.url}</p>
          <p className="mb-2">Location: {results.location}</p>
          <p className="mb-2">Language: {results.language}</p>
          <h4 className="text-lg font-bold mt-4">SERP Data</h4>
          <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(results.serpData, null, 2)}</pre>
          <h4 className="text-lg font-bold mt-4">PageSpeed Data</h4>
          <pre className="bg-gray-100 p-4 rounded-lg">{JSON.stringify(results.pageSpeedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default MainPage;
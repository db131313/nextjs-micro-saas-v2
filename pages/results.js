import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const API_KEY = "AIzaSyDlc54LBF2pEDWQiC7JUG7kB5PaFsoytAE";
const SEARCH_ENGINE_ID = "615b8aae2d40343b8";

export default function Results() {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      fetchGoogleImages(query);
    }
  }, [query]);

  const fetchGoogleImages = async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${keyword}&cx=${SEARCH_ENGINE_ID}&searchType=image&key=${API_KEY}`);
      const data = await response.json();
      if (data.error) {
        setError(`Error: ${data.error.message}`);
      } else if (!data.items || data.items.length === 0) {
        setError("No results found.");
      } else {
        setSearchResults(data.items);
      }
    } catch (error) {
      setError("Failed to fetch results. Try again later.");
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="mb-6">Results for: <strong>{query || 'No keyword provided'}</strong></p>

      {loading && <p className="text-gray-400">Loading results...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {searchResults.length > 0 ? searchResults.map((result, index) => (
          <a key={index} href={result.image.contextLink} className="flex flex-col items-center justify-center h-40 bg-white text-black font-bold rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
            <img src={result.link} alt={result.title} className="w-full h-full object-cover rounded-lg" />
          </a>
        )) : !loading && <p>No results found.</p>}
      </div>

      <button 
        onClick={() => router.push('/')} 
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
      >
        Back to Search
      </button>
    </div>
  );
}

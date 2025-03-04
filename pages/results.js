import '../styles/globals.css';
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

  // Styling states
  const [gridCols, setGridCols] = useState("grid-cols-3");
  const [borderRadius, setBorderRadius] = useState("rounded-lg");
  const [gap, setGap] = useState("gap-6");

  // Dropdown panel state for styling controls
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (query) {
      fetchGoogleImages(query);
    }
  }, [query]);

  const fetchGoogleImages = async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${keyword}&cx=${SEARCH_ENGINE_ID}&searchType=image&key=${API_KEY}`
      );
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 relative">
      
      {/* Toggleable Settings Icon Dropdown */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setPanelOpen(!panelOpen)}
          className="p-2 bg-white text-black rounded-full shadow-lg border border-gray-300"
        >
          {/* Inline SVG for a gear (cog) icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894a1.125 1.125 0 00.986.95l.963.07c.554.04.92.54.68 1.04l-.383.766a1.125 1.125 0 000 1.06l.383.767c.24.5-.126 1-.68 1.04l-.963.07a1.125 1.125 0 00-.986.95l-.15.893c-.09.543-.56.94-1.11.94h-1.094a1.125 1.125 0 01-1.11-.94l-.15-.893a1.125 1.125 0 00-.986-.95l-.963-.07c-.554-.04-.92-.54-.68-1.04l.383-.767a1.125 1.125 0 000-1.06l-.383-.766c-.24-.5.126-1 .68-1.04l.963-.07a1.125 1.125 0 00.986-.95l.15-.893z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        {panelOpen && (
          <div className="mt-2 bg-white text-black p-4 rounded-lg shadow-lg w-72 border border-gray-300">
            <h3 className="text-lg font-bold mb-2">Customize View</h3>
            
            <label className="block mb-2 text-sm">Grid Columns:</label>
            <select
              value={gridCols}
              onChange={(e) => setGridCols(e.target.value)}
              className="w-full p-2 mb-3 border rounded text-black"
            >
              <option value="grid-cols-1">1 Column</option>
              <option value="grid-cols-2">2 Columns</option>
              <option value="grid-cols-3">3 Columns</option>
              <option value="grid-cols-4">4 Columns</option>
            </select>

            <label className="block mb-2 text-sm">Border Radius:</label>
            <select
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="w-full p-2 mb-3 border rounded text-black"
            >
              <option value="rounded-none">No Rounding</option>
              <option value="rounded-md">Small</option>
              <option value="rounded-lg">Medium</option>
              <option value="rounded-xl">Large</option>
            </select>

            <label className="block mb-2 text-sm">Grid Gap:</label>
            <select
              value={gap}
              onChange={(e) => setGap(e.target.value)}
              className="w-full p-2 mb-3 border rounded text-black"
            >
              <option value="gap-2">Small Gap</option>
              <option value="gap-4">Medium Gap</option>
              <option value="gap-6">Large Gap</option>
            </select>
          </div>
        )}
      </div>

      {/* Header & Search Input */}
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <input
        type="text"
        placeholder="Search again..."
        className="w-full max-w-md p-4 border border-gray-300 rounded-lg mb-4 text-black"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            router.push(`/results?query=${encodeURIComponent(e.target.value)}`);
          }
        }}
      />
      <p className="mb-6">
        Results for: <strong>{query || "No keyword provided"}</strong>
      </p>

      {loading && <p className="text-gray-400">Loading results...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Results Grid */}
      <div className={`grid ${gridCols} ${gap} w-full max-w-5xl`}>
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <a
              key={index}
              href={result.image.contextLink}
              className={`flex flex-col items-center justify-center h-40 bg-white text-black font-bold shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 ${borderRadius}`}
            >
              <img
                src={result.link}
                alt={result.title}
                className={`w-full h-full object-cover ${borderRadius}`}
              />
            </a>
          ))
        ) : (
          !loading && <p>No results found.</p>
        )}
      </div>

      {/* Back to Search Button */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
      >
        Back to Search
      </button>
    </div>
  );
}



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
      {/* Settings Icon & Dropdown - using inline styles and an inline SVG */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1000 }}>
        <button 
          onClick={() => setPanelOpen(!panelOpen)}
          style={{
            background: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "50%",
            padding: "0.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ display: "block" }}
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a1.65 1.65 0 0 1-2.33 2.33l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 1-2.11 0 1.65 1.65 0 0 0-1.82.33l0 0a1.65 1.65 0 0 1-2.33-2.33l0 0a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 1 0-2.11 1.65 1.65 0 0 0 .33-1.82l0 0a1.65 1.65 0 0 1 2.33-2.33l0 0a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 1 2.11 0 1.65 1.65 0 0 0 1.82-.33l0 0a1.65 1.65 0 0 1 2.33 2.33l0 0a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 1 0 2.11z"></path>
          </svg>
        </button>
        {panelOpen && (
          <div style={{
            marginTop: "0.5rem",
            background: "#fff",
            color: "#000",
            padding: "1rem",
            borderRadius: "0.5rem",
            width: "18rem",
            border: "1px solid #d1d5db",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Customize View</h3>
            
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Grid Columns:</label>
              <select
                value={gridCols}
                onChange={(e) => setGridCols(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  color: "#000"
                }}
              >
                <option value="grid-cols-1">1 Column</option>
                <option value="grid-cols-2">2 Columns</option>
                <option value="grid-cols-3">3 Columns</option>
                <option value="grid-cols-4">4 Columns</option>
              </select>
            </div>
            
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Border Radius:</label>
              <select
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  color: "#000"
                }}
              >
                <option value="rounded-none">No Rounding</option>
                <option value="rounded-md">Small</option>
                <option value="rounded-lg">Medium</option>
                <option value="rounded-xl">Large</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Grid Gap:</label>
              <select
                value={gap}
                onChange={(e) => setGap(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  color: "#000"
                }}
              >
                <option value="gap-2">Small Gap</option>
                <option value="gap-4">Medium Gap</option>
                <option value="gap-6">Large Gap</option>
              </select>
            </div>
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
      <p className="mb-6">Results for: <strong>{query || "No keyword provided"}</strong></p>

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



import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Use your provided API keys:
const API_KEY = "AIzaSyDlc54LBF2pEDWQiC7JUG7kB5PaFsoytAE";
const SEARCH_ENGINE_ID = "615b8aae2d40343b8";

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  // Search result state
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- Grid & Link Card Controls -----
  const [gridLayout, setGridLayout] = useState("masonry-vertical"); // default: "masonry-vertical"
  const [linkCardHeight, setLinkCardHeight] = useState(250);
  const [linkCardWidth, setLinkCardWidth] = useState(250);
  const [gridGap, setGridGap] = useState(10);
  const [cardBorderRadius, setCardBorderRadius] = useState(8);
  const [cardBorderWidth, setCardBorderWidth] = useState(1);
  const [cardBorderColor, setCardBorderColor] = useState("#d1d5db");

  // ----- Link Text & Content Styling Controls -----
  const [linkFontFamily, setLinkFontFamily] = useState("Arial, sans-serif");
  const [linkFontWeight, setLinkFontWeight] = useState("400");
  const [linkFontColor, setLinkFontColor] = useState("#ffffff");
  const [linkTextPosition, setLinkTextPosition] = useState("bottom");
  const [linkBackgroundColor, setLinkBackgroundColor] = useState("rgba(0,0,0,0.4)");
  const [linkPadding, setLinkPadding] = useState(10);

  // ----- Full Page Background Controls -----
  const [bgColor, setBgColor] = useState("#111111");
  const [bgGradient, setBgGradient] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const [bgVideo, setBgVideo] = useState("");

  // Control panel toggle
  const [panelOpen, setPanelOpen] = useState(false);

  // Ref for background video iframe
  const videoRef = useRef(null);

  // Fetch search results (images) when query changes
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

  // Handle background image upload
  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setBgImage(imgUrl);
    }
  };

  // ----- Dynamic Styles -----

  // Full-page background style
  const backgroundStyle = {
    backgroundColor: bgColor,
    backgroundImage: bgGradient
      ? bgGradient
      : bgImage
      ? `url(${bgImage})`
      : "none",
    backgroundSize: bgImage ? "cover" : "auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  // Grid container style based on chosen layout
  let gridContainerStyle = { gap: `${gridGap}px` };
  if (gridLayout === "simple-grid") {
    gridContainerStyle.display = "grid";
    gridContainerStyle.gridTemplateColumns = `repeat(auto-fill, minmax(${linkCardWidth}px, 1fr))`;
  } else if (gridLayout === "masonry-vertical") {
    // CSS columns for vertical masonry
    gridContainerStyle.columnCount = 3; // adjust as needed
    gridContainerStyle.columnGap = `${gridGap}px`;
  } else if (gridLayout === "masonry-horizontal") {
    gridContainerStyle.display = "flex";
    gridContainerStyle.flexWrap = "nowrap";
    gridContainerStyle.overflowX = "auto";
    gridContainerStyle.gap = `${gridGap}px`;
  }

  // Each link card container style
  // Note the marginBottom to help spacing in column-based layouts
  // We'll set breakInside inline on each card to ensure they don’t break
  const cardStyleBase = {
    position: "relative",
    overflow: "hidden",
    borderRadius: `${cardBorderRadius}px`,
    border: `${cardBorderWidth}px solid ${cardBorderColor}`,
    marginBottom: gridLayout === "masonry-vertical" ? `${gridGap}px` : undefined,
    // If simple-grid or horizontal, use specified width; otherwise full width for column
    width:
      gridLayout === "simple-grid" || gridLayout === "masonry-horizontal"
        ? `${linkCardWidth}px`
        : "100%",
    height: `${linkCardHeight}px`,
  };

  // Overlay style for link text
  const overlayStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: linkBackgroundColor,
    padding: `${linkPadding}px`,
    fontFamily: linkFontFamily,
    fontWeight: linkFontWeight,
    color: linkFontColor,
    display: "flex",
    alignItems:
      linkTextPosition === "top"
        ? "flex-start"
        : linkTextPosition === "middle"
        ? "center"
        : "flex-end",
    zIndex: 10,
  };

  // Helper: get favicon URL using Google's favicon service
  const getFaviconUrl = (url) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch {
      return "";
    }
  };

  return (
    <div style={backgroundStyle} className="min-h-screen relative">
      {/* Optional Background Video */}
      {bgVideo && (
        <div className="absolute inset-0 z-[-1]">
          <iframe
            ref={videoRef}
            width="100%"
            height="100%"
            src={`${bgVideo}?autoplay=1&mute=1&loop=1&start=0&end=10&playlist=${bgVideo}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full object-cover"
          ></iframe>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-white p-6">
        {/* Styling Controls Panel Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-2 bg-white text-black rounded-full shadow border border-gray-300"
          >
            {/* Inline gear icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a1.65 1.65 0 0 1-2.33 2.33l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 1-2.11 0 1.65 1.65 0 0 0-1.82.33l0 0a1.65 1.65 0 0 1-2.33-2.33l0 0a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 1 0-2.11 1.65 1.65 0 0 0 .33-1.82l0 0a1.65 1.65 0 0 1 2.33-2.33l0 0a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 1 2.11 0 1.65 1.65 0 0 0 1.82-.33l0 0a1.65 1.65 0 0 1 2.33 2.33l0 0a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 1 0 2.11z" />
            </svg>
          </button>
          {panelOpen && (
            <div className="mt-2 bg-white text-black p-4 rounded shadow border border-gray-300 max-h-[90vh] overflow-y-auto w-80">
              <h3 className="text-lg font-bold mb-2">Customize View</h3>

              {/* Grid Layout & Dimensions */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Grid Layout:</label>
                <select
                  value={gridLayout}
                  onChange={(e) => setGridLayout(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                >
                  <option value="simple-grid">Simple Grid</option>
                  <option value="masonry-vertical">Masonry Vertical</option>
                  <option value="masonry-horizontal">Masonry Horizontal</option>
                </select>

                <label className="block text-sm mb-1">
                  Link Card Height: {linkCardHeight}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={linkCardHeight}
                  onChange={(e) => setLinkCardHeight(Number(e.target.value))}
                  className="w-full mb-2"
                />

                {/* Only show width slider if not vertical masonry */}
                {gridLayout !== "masonry-vertical" && (
                  <>
                    <label className="block text-sm mb-1">
                      Link Card Width: {linkCardWidth}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      value={linkCardWidth}
                      onChange={(e) =>
                        setLinkCardWidth(Number(e.target.value))
                      }
                      className="w-full mb-2"
                    />
                  </>
                )}

                <label className="block text-sm mb-1">
                  Grid Gap: {gridGap}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={gridGap}
                  onChange={(e) => setGridGap(Number(e.target.value))}
                  className="w-full mb-2"
                />
              </div>

              {/* Border & Card Styling */}
              <div className="mb-4">
                <label className="block text-sm mb-1">
                  Border Radius: {cardBorderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cardBorderRadius}
                  onChange={(e) =>
                    setCardBorderRadius(Number(e.target.value))
                  }
                  className="w-full mb-2"
                />

                <label className="block text-sm mb-1">
                  Border Width: {cardBorderWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={cardBorderWidth}
                  onChange={(e) =>
                    setCardBorderWidth(Number(e.target.value))
                  }
                  className="w-full mb-2"
                />

                <label className="block text-sm mb-1">Border Color:</label>
                <input
                  type="color"
                  value={cardBorderColor}
                  onChange={(e) => setCardBorderColor(e.target.value)}
                  className="w-full mb-2 h-8 p-0"
                />
              </div>

              {/* Link Text & Content Styling */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Font Family:</label>
                <select
                  value={linkFontFamily}
                  onChange={(e) => setLinkFontFamily(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Helvetica Neue', sans-serif">
                    Helvetica Neue
                  </option>
                  <option value="'Times New Roman', serif">
                    Times New Roman
                  </option>
                  <option value="'Courier New', monospace">
                    Courier New
                  </option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>

                <label className="block text-sm mb-1">Font Weight:</label>
                <select
                  value={linkFontWeight}
                  onChange={(e) => setLinkFontWeight(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                >
                  <option value="100">100</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                </select>

                <label className="block text-sm mb-1">Font Color:</label>
                <input
                  type="color"
                  value={linkFontColor}
                  onChange={(e) => setLinkFontColor(e.target.value)}
                  className="w-full mb-2 h-8 p-0"
                />

                <label className="block text-sm mb-1">Text Position:</label>
                <select
                  value={linkTextPosition}
                  onChange={(e) => setLinkTextPosition(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                >
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>

                <label className="block text-sm mb-1">
                  Link Background Color:
                </label>
                <input
                  type="color"
                  value={linkBackgroundColor}
                  onChange={(e) => setLinkBackgroundColor(e.target.value)}
                  className="w-full mb-2 h-8 p-0"
                />

                <label className="block text-sm mb-1">
                  Link Padding: {linkPadding}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={linkPadding}
                  onChange={(e) => setLinkPadding(Number(e.target.value))}
                  className="w-full mb-2"
                />
              </div>

              {/* Full Page Background Controls */}
              <div className="mb-4">
                <h4 className="text-md font-bold mb-1">Background</h4>
                <label className="block text-sm mb-1">Background Color:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full mb-2 h-8 p-0"
                />

                <label className="block text-sm mb-1">
                  Background Gradient:
                </label>
                <select
                  value={bgGradient}
                  onChange={(e) => setBgGradient(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                >
                  <option value="">None</option>
                  <option value="linear-gradient(45deg, #ff6b6b, #f06595)">
                    Sunset
                  </option>
                  <option value="linear-gradient(45deg, #74c0fc, #4dabf7)">
                    Skyline
                  </option>
                  <option value="linear-gradient(45deg, #a9e34b, #74c69d)">
                    Mint
                  </option>
                  <option value="linear-gradient(45deg, #f59f00, #f76707)">
                    Orange Burst
                  </option>
                  <option value="linear-gradient(45deg, #845ef7, #5c7cfa)">
                    Violet Haze
                  </option>
                </select>

                <label className="block text-sm mb-1">Background Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="w-full mb-2"
                />

                <label className="block text-sm mb-1">
                  Background Video (YouTube URL):
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  value={bgVideo}
                  onChange={(e) => setBgVideo(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                />
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
        <p className="mb-6">
          Results for: <strong>{query || "No keyword provided"}</strong>
        </p>

        {loading && <p className="text-gray-400">Loading results...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Results Grid Container (full-width) */}
        <div style={gridContainerStyle} className="w-full">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => {
              // For each card, we merge base style with breakInside to ensure masonry works
              const cardStyle = {
                ...cardStyleBase,
                // Ensure columns don't break the card
                breakInside: "avoid",
                WebkitColumnBreakInside: "avoid",
                MozColumnBreakInside: "avoid",
              };

              return (
                <a
                  key={index}
                  href={result.image.contextLink}
                  style={cardStyle}
                  className="relative"
                >
                  {/* Full-background image */}
                  {result.link && (
                    <img
                      src={result.link}
                      alt={result.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  {/* Overlay with favicon and truncated text */}
                  <div style={overlayStyle} className="relative z-10 flex items-center">
                    {result.image && result.image.contextLink && (
                      <img
                        src={getFaviconUrl(result.image.contextLink)}
                        alt="favicon"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "4px",
                        }}
                      />
                    )}
                    <p className="text-sm m-0">{result.title}</p>
                  </div>
                </a>
              );
            })
          ) : (
            !loading && <p>No results found.</p>
          )}
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
}


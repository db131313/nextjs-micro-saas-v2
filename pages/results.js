import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Use your provided API keys:
const API_KEY = "AIzaSyDlc54LBF2pEDWQiC7JUG7kB5PaFsoytAE";
const SEARCH_ENGINE_ID = "615b8aae2d40343b8";

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  // ----- Search State -----
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----- Grid & Card Controls -----
  // Default to "masonry-vertical" (we'll approximate it with a 3-column grid for drag-and-drop).
  const [gridLayout, setGridLayout] = useState("masonry-vertical");
  const [linkCardHeight, setLinkCardHeight] = useState(250);
  const [linkCardWidth, setLinkCardWidth] = useState(250);
  const [gridGap, setGridGap] = useState(10);
  const [cardBorderRadius, setCardBorderRadius] = useState(8);
  const [cardBorderWidth, setCardBorderWidth] = useState(1);
  const [cardBorderColor, setCardBorderColor] = useState("#d1d5db");

  // ----- Link Text & Content Controls -----
  const [linkFontFamily, setLinkFontFamily] = useState("Arial, sans-serif");
  const [linkFontWeight, setLinkFontWeight] = useState("400");
  const [linkFontColor, setLinkFontColor] = useState("#ffffff");
  const [linkTextPosition, setLinkTextPosition] = useState("bottom");
  const [linkBackgroundColor, setLinkBackgroundColor] = useState("rgba(0,0,0,0.4)");
  const [linkPadding, setLinkPadding] = useState(10);
  // New: Font Size for link text
  const [linkFontSize, setLinkFontSize] = useState(14);

  // ----- Full-Page Background Controls -----
  const [bgColor, setBgColor] = useState("#111111");
  const [bgGradient, setBgGradient] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const [bgVideo, setBgVideo] = useState("");

  // ----- Control Panel Toggle -----
  const [panelOpen, setPanelOpen] = useState(false);

  // ----- Edit Modal State (Stub) -----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

  // ----- Drag-and-Drop State -----
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);

  // Background video ref
  const videoRef = useRef(null);

  // Fetch images from Google when `query` changes
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

  // Helper: reorder array items
  const reorderList = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // ----- Drag-and-Drop Handlers -----
  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (index, e) => {
    e.preventDefault(); // allow drop
    setDragOverItemIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedItemIndex !== null && dragOverItemIndex !== null) {
      const newResults = reorderList(searchResults, draggedItemIndex, dragOverItemIndex);
      setSearchResults(newResults);
    }
    // Cleanup
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  // ----- Link Card Actions -----
  const openEditModal = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setModalIndex(null);
  };

  const deleteCard = (index) => {
    const updated = [...searchResults];
    updated.splice(index, 1);
    setSearchResults(updated);
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

  // Grid container style (approx. “masonry vertical” with a 3-column grid)
  let gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridGap: `${gridGap}px`,
  };

  // If user chooses a different layout:
  if (gridLayout === "simple-grid") {
    gridContainerStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${linkCardWidth}px, 1fr))`,
      gap: `${gridGap}px`,
    };
  } else if (gridLayout === "masonry-horizontal") {
    gridContainerStyle = {
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      gap: `${gridGap}px`,
    };
  }

  // Card container base style
  const cardStyleBase = {
    position: "relative",
    overflow: "hidden",
    borderRadius: `${cardBorderRadius}px`,
    border: `${cardBorderWidth}px solid ${cardBorderColor}`,
    width: gridLayout === "masonry-horizontal" || gridLayout === "simple-grid"
      ? `${linkCardWidth}px`
      : "100%",
    height: `${linkCardHeight}px`,
  };

  // Overlay style for link text & icons
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
    fontSize: `${linkFontSize}px`,
    display: "flex",
    alignItems:
      linkTextPosition === "top"
        ? "flex-start"
        : linkTextPosition === "middle"
        ? "center"
        : "flex-end",
    justifyContent: "space-between", // so text is left, icons can be right
    zIndex: 10,
  };

  // Helper: get favicon from Google
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
        {/* Control Panel Toggle */}
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
                      onChange={(e) => setLinkCardWidth(Number(e.target.value))}
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

                <label className="block text-sm mb-1">Font Size: {linkFontSize}px</label>
                <input
                  type="range"
                  min="10"
                  max="36"
                  value={linkFontSize}
                  onChange={(e) => setLinkFontSize(Number(e.target.value))}
                  className="w-full mb-2"
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

        {/* Results Grid Container (approx. “masonry vertical” with 3 columns) */}
        <div style={gridContainerStyle} className="w-full">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => {
              const cardStyle = {
                ...cardStyleBase,
                // Drag & drop
                cursor: "move",
              };

              return (
                <div
                  key={index}
                  style={cardStyle}
                  className="relative"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
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

                  {/* Overlay with text and icons */}
                  <div style={overlayStyle}>
                    {/* Left side: Favicon + Title */}
                    <div className="flex items-center">
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
                      <p className="text-sm m-0 line-clamp-2">{result.title}</p>
                    </div>

                    {/* Right side: Action Icons (Edit, Delete, Move) */}
                    <div className="flex items-center space-x-2">
                      {/* Edit Icon */}
                      <button
                        onClick={() => openEditModal(index)}
                        className="bg-transparent border-none cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 2.487a2.25 2.25 0 113.182 3.182L7.136 18.578a4.5 4.5 0 01-1.892 1.131l-2.835.945.945-2.835a4.5 4.5 0 011.131-1.892l12.377-12.44z"
                          />
                        </svg>
                      </button>

                      {/* Delete Icon */}
                      <button
                        onClick={() => deleteCard(index)}
                        className="bg-transparent border-none cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l.45 8.25m4.5-8.25l-.45 8.25M6.75 5.25h10.5m-9 
                              0v-.75a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 
                              012.25 2.25v.75m-9 0h9m-9 0h-1.5m10.5 0h1.5M4.5 
                              5.25h15m-2.25 0v13.5a2.25 2.25 0 
                              01-2.25 2.25h-6a2.25 2.25 0 
                              01-2.25-2.25V5.25"
                          />
                        </svg>
                      </button>

                      {/* Move Icon (purely cosmetic, actual dragging is on the card) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5 cursor-move"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 4.5V3.75a.75.75 0 
                             111.5 0v.75h3V3.75a.75.75 0 
                             111.5 0v.75h1.75a2.25 2.25 0 
                             012.25 2.25v12a2.25 2.25 0 
                             01-2.25 2.25H7.25a2.25 2.25 0 
                             01-2.25-2.25v-12a2.25 2.25 0 
                             012.25-2.25H9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.25h6m-6 3h6m-6 3h6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            !loading && <p>No results found.</p>
          )}
        </div>

        {/* Back to Search */}
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
        >
          Back to Search
        </button>
      </div>

      {/* Stub Edit Modal */}
      {isModalOpen && modalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Edit Link Card (Stub)</h2>
            <p className="mb-4">
              This is a placeholder for editing the link card. You can add
              actual edit fields here (e.g., changing title, image URL, etc.).
            </p>
            <button
              onClick={closeEditModal}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


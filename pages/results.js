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
  // Default to "masonry-vertical" layout.
  const [gridLayout, setGridLayout] = useState("masonry-vertical");
  const [linkCardWidth, setLinkCardWidth] = useState(250); // used for simple-grid/horizontal
  const [gridGap, setGridGap] = useState(10);
  // Default theme: no border and no border radius.
  const [cardBorderRadius, setCardBorderRadius] = useState(0);
  const [cardBorderWidth, setCardBorderWidth] = useState(0);
  const [cardBorderColor, setCardBorderColor] = useState("#d1d5db");

  // ----- Link Text & Content Styling Controls -----
  const [linkFontFamily, setLinkFontFamily] = useState("Arial, sans-serif");
  const [linkFontWeight, setLinkFontWeight] = useState("400");
  const [linkFontColor, setLinkFontColor] = useState("#ffffff");
  const [linkFontSize, setLinkFontSize] = useState(14);
  const [linkTextPosition, setLinkTextPosition] = useState("bottom");
  const [linkBackgroundColor, setLinkBackgroundColor] = useState("rgba(0,0,0,0.4)");
  const [linkPadding, setLinkPadding] = useState(10);

  // ----- Full-Page Background Controls -----
  const [bgColor, setBgColor] = useState("#111111");
  const [bgGradient, setBgGradient] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const [bgVideo, setBgVideo] = useState("");

  // ----- Control Panel Toggle -----
  const [panelOpen, setPanelOpen] = useState(false);

  // ----- Mobile View Check -----
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 700);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ----- Edit Modal State (Stub) -----
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

  // ----- Drag-and-Drop State -----
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);

  // Background video ref
  const videoRef = useRef(null);

  // ----- Fetch Search Results -----
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
        // Filter: only items with an image and no duplicates (by image link)
        const seen = new Set();
        const uniqueResults = data.items.filter((item) => {
          if (!item.image || !item.link) return false;
          if (seen.has(item.link)) return false;
          seen.add(item.link);
          return true;
        });
        setSearchResults(uniqueResults);
      }
    } catch (error) {
      setError("Failed to fetch results. Try again later.");
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  // ----- Background Image Upload Handler -----
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
    backgroundImage: bgGradient ? bgGradient : bgImage ? `url(${bgImage})` : "none",
    backgroundSize: bgImage ? "cover" : "auto",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  // For "masonry-vertical", use CSS columns.
  let containerStyle = {};
  if (gridLayout === "masonry-vertical") {
    containerStyle = {
      columnCount: isMobile ? 1 : 3,
      columnGap: `${gridGap}px`,
      width: "100%",
    };
  } else if (gridLayout === "simple-grid") {
    containerStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${linkCardWidth}px, 1fr))`,
      gap: `${gridGap}px`,
      width: "100%",
    };
  } else if (gridLayout === "masonry-horizontal") {
    containerStyle = {
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      gap: `${gridGap}px`,
      width: "100%",
    };
  }

  // Card style: for masonry-vertical, let image define height
  const cardStyleBase = {
    position: "relative",
    overflow: "hidden",
    borderRadius: `${cardBorderRadius}px`,
    border: `${cardBorderWidth}px solid ${cardBorderColor}`,
    marginBottom: gridLayout === "masonry-vertical" ? `${gridGap}px` : undefined,
    width:
      gridLayout === "simple-grid" || gridLayout === "masonry-horizontal"
        ? `${linkCardWidth}px`
        : "100%",
    // For masonry, let the image keep its natural aspect ratio.
    breakInside: "avoid",
    WebkitColumnBreakInside: "avoid",
    MozColumnBreakInside: "avoid",
    cursor: "move",
  };

  // Overlay for link text and icons
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
    justifyContent: "space-between",
    zIndex: 10,
  };

  // Helper: get favicon URL using Google's service
  const getFaviconUrl = (url) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch {
      return "";
    }
  };

  // ----- Drag-and-Drop Handlers -----
  const reorderList = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (index, e) => {
    e.preventDefault();
    setDragOverItemIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedItemIndex !== null && dragOverItemIndex !== null) {
      const newResults = reorderList(searchResults, draggedItemIndex, dragOverItemIndex);
      setSearchResults(newResults);
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  // ----- Card Actions -----
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

  // ----- YouTube Background Fix -----
  // Parse a YouTube URL from various formats and build a proper embed URL.
  function parseYouTubeUrl(url) {
    if (!url) return null;
    try {
      if (url.includes("/embed/")) {
        return url.split("/embed/")[1].split(/[?&]/)[0];
      }
      if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1].split(/[?&]/)[0];
      }
      if (url.includes("watch?v=")) {
        return url.split("watch?v=")[1].split(/[?&]/)[0];
      }
    } catch {
      return null;
    }
    return null;
  }
  function getYouTubeEmbedUrl(rawUrl) {
    const vid = parseYouTubeUrl(rawUrl);
    if (!vid) return null;
    return `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&loop=1&start=0&end=10&playlist=${vid}`;
  }
  const embedUrl = getYouTubeEmbedUrl(bgVideo);

  return (
    <div style={backgroundStyle} className="min-h-screen relative">
      {/* Optional Background Video */}
      {embedUrl && (
        <div className="absolute inset-0 z-[-1]">
          <iframe
            ref={videoRef}
            width="100%"
            height="100%"
            src={embedUrl}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full object-cover"
          ></iframe>
        </div>
      )}

      <div className="relative z-10 flex flex-col text-white p-6">
        {/* Search Input at Top-Left */}
        <div className="absolute top-4 left-4 z-50">
          <input
            type="text"
            placeholder="Search..."
            defaultValue={query || ""}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                router.push(`/results?query=${encodeURIComponent(e.target.value)}`);
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded text-black"
            style={{ height: "50px", minWidth: "200px" }}
          />
        </div>

        {/* Control Panel Toggle (remains at top-right) */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-2 bg-white text-black rounded-full shadow border border-gray-300"
          >
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
                  <option value="masonry-vertical">Masonry Vertical</option>
                  <option value="simple-grid">Simple Grid</option>
                  <option value="masonry-horizontal">Masonry Horizontal</option>
                </select>
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
                <label className="block text-sm mb-1">
                  Font Size: {linkFontSize}px
                </label>
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
                  Background Video (YouTube link):
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://youtu.be/VIDEO_ID"
                  value={bgVideo}
                  onChange={(e) => setBgVideo(e.target.value)}
                  className="w-full p-2 border rounded text-black mb-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* (The "Search Results" header has been removed as requested) */}

        {loading && <p className="text-gray-400">Loading results...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Masonry / Grid Container */}
        <div style={containerStyle} className="w-full">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div
                key={index}
                style={cardStyleBase}
                className="mb-4 relative break-inside-avoid"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                {/* Display image preserving its natural aspect ratio */}
                {result.link && (
                  <img
                    src={result.link}
                    alt={result.title}
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                )}
                {/* Overlay with text and action icons */}
                <div style={overlayStyle} className="relative z-10 flex items-center">
                  <div className="flex items-center">
                    {result.image && result.image.contextLink && (
                      <img
                        src={getFaviconUrl(result.image.contextLink)}
                        alt="favicon"
                        style={{ width: "16px", height: "16px", marginRight: "4px" }}
                      />
                    )}
                    <p className="text-sm m-0 line-clamp-2">{result.title}</p>
                  </div>
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
                          d="M9.75 9.75l.45 8.25m4.5-8.25l-.45 8.25M6.75 5.25h10.5m-9 0v-.75a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v.75m-9 0h9"
                        />
                      </svg>
                    </button>
                    {/* Move Icon */}
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
                        d="M9 4.5V3.75a.75.75 0 111.5 0v.75h3V3.75a.75.75 0 111.5 0v.75h1.75a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H7.25a2.25 2.25 0 01-2.25-2.25v-12a2.25 2.25 0 012.25-2.25H9z"
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

      {/* Stub Edit Modal */}
      {isModalOpen && modalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Edit Link Card (Stub)</h2>
            <p className="mb-4">
              This is a placeholder for editing the link card. Add your edit
              controls here.
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

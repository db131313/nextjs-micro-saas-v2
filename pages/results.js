import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Your API keys
const API_KEY = "AIzaSyDlc54LBF2pEDWQiC7JUG7kB5PaFsoytAE";
const SEARCH_ENGINE_ID = "615b8aae2d40343b8";

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  // --- Search State ---
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Mobile Detection ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Style Control Panel States ---
  // Grid Layout: "masonry-vertical", "simple-grid", "masonry-horizontal"
  const [gridLayout, setGridLayout] = useState("masonry-vertical");
  // For non‑vertical layouts
  const [linkCardWidth, setLinkCardWidth] = useState(250);
  const [gridGap, setGridGap] = useState(10);
  // Default theme: no border and no border radius
  const [cardBorderRadius, setCardBorderRadius] = useState(0);
  const [cardBorderWidth, setCardBorderWidth] = useState(0);
  const [cardBorderColor, setCardBorderColor] = useState("#d1d5db");

  // Link text styling
  const [linkFontFamily, setLinkFontFamily] = useState("Arial, sans-serif");
  const [linkFontWeight, setLinkFontWeight] = useState("400");
  const [linkFontColor, setLinkFontColor] = useState("#ffffff");
  const [linkFontSize, setLinkFontSize] = useState(14);
  const [linkTextPosition, setLinkTextPosition] = useState("bottom");
  const [linkBackgroundColor, setLinkBackgroundColor] = useState("rgba(0,0,0,0.4)");
  const [linkPadding, setLinkPadding] = useState(10);

  // Full-page background styling
  const [bgColor, setBgColor] = useState("#111111");
  const [bgGradient, setBgGradient] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const [bgVideo, setBgVideo] = useState("");

  // Toggle for style control panel dropdown
  const [panelOpen, setPanelOpen] = useState(false);

  // --- Fetch Search Results ---
  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (keyword) => {
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
        // Filter: Only include items with an image & remove duplicate image links
        const seen = new Set();
        const uniqueResults = data.items.filter((item) => {
          if (!item.image || !item.link) return false;
          if (seen.has(item.link)) return false;
          seen.add(item.link);
          return true;
        });
        setSearchResults(uniqueResults);
      }
    } catch (err) {
      setError("Failed to fetch results. Try again later.");
      console.error(err);
    }
    setLoading(false);
  };

  // --- Background Image Upload Handler ---
  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
    }
  };

  // --- YouTube Background Embed ---
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

  // --- Dynamic Styles ---

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
    minHeight: "100vh",
    paddingTop: "70px", // leave room for top-left search input
  };

  // Container style for masonry-vertical layout using CSS columns.
  // On mobile, force one column; otherwise, three columns.
  const containerStyle =
    gridLayout === "masonry-vertical"
      ? { columnCount: isMobile ? 1 : 3, columnGap: `${gridGap}px`, width: "100%" }
      : gridLayout === "simple-grid"
      ? {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${linkCardWidth}px, 1fr))`,
          gap: `${gridGap}px`,
          width: "100%",
        }
      : {
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: `${gridGap}px`,
          width: "100%",
        };

  // Default card style: for masonry, let images retain natural aspect ratio.
  const cardStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: `${cardBorderRadius}px`,
    border: `${cardBorderWidth}px solid ${cardBorderColor}`,
    marginBottom: gridLayout === "masonry-vertical" ? `${gridGap}px` : undefined,
    width:
      gridLayout === "simple-grid" || gridLayout === "masonry-horizontal"
        ? `${linkCardWidth}px`
        : "100%",
    breakInside: "avoid",
    WebkitColumnBreakInside: "avoid",
    MozColumnBreakInside: "avoid",
    cursor: "default",
  };

  // Overlay style for link text (and later action icons if desired)
  const overlayDivStyle = {
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

  // Helper: get favicon using Google's service
  const getFaviconUrl = (url) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch {
      return "";
    }
  };

  return (
    <div style={backgroundStyle}>
      {/* Optional Background Video */}
      {embedUrl && (
        <div className="absolute inset-0 z-[-1]">
          <iframe
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

      {/* Search Input in Top-Left */}
      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 50 }}>
        <input
          type="text"
          defaultValue={query || ""}
          placeholder="Search..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              router.push(`/results?query=${encodeURIComponent(e.target.value)}`);
            }
          }}
          style={{
            height: "50px",
            minWidth: "200px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Style Control Panel Dropdown Toggle (Gear Icon) at Top-Right */}
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 50 }}>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          style={{
            padding: "8px",
            background: "#fff",
            color: "#000",
            border: "1px solid #ccc",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            style={{ width: "24px", height: "24px" }}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a1.65 1.65 0 0 1-2.33 2.33l0 0a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 1-2.11 0 1.65 1.65 0 0 0-1.82.33l0 0a1.65 1.65 0 0 1-2.33-2.33l0 0a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 1 0-2.11 1.65 1.65 0 0 0 .33-1.82l0 0a1.65 1.65 0 0 1 2.33-2.33l0 0a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 1 2.11 0 1.65 1.65 0 0 0 1.82-.33l0 0a1.65 1.65 0 0 1 2.33 2.33l0 0a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 1 0 2.11z" />
          </svg>
        </button>
        {panelOpen && (
          <div
            style={{
              marginTop: "10px",
              background: "#fff",
              color: "#000",
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "300px",
              position: "absolute",
              right: "10px",
              top: "60px",
              zIndex: 50,
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
              Customize View
            </h3>
            {/* Grid Layout & Dimensions */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Grid Layout:
              </label>
              <select
                value={gridLayout}
                onChange={(e) => setGridLayout(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="masonry-vertical">Masonry Vertical</option>
                <option value="simple-grid">Simple Grid</option>
                <option value="masonry-horizontal">Masonry Horizontal</option>
              </select>
            </div>
            {(gridLayout === "simple-grid" || gridLayout === "masonry-horizontal") && (
              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                  Link Card Width: {linkCardWidth}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={linkCardWidth}
                  onChange={(e) => setLinkCardWidth(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            )}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Grid Gap: {gridGap}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={gridGap}
                onChange={(e) => setGridGap(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            {/* Border & Card Styling */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Border Radius: {cardBorderRadius}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={cardBorderRadius}
                onChange={(e) => setCardBorderRadius(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Border Width: {cardBorderWidth}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={cardBorderWidth}
                onChange={(e) => setCardBorderWidth(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Border Color:
              </label>
              <input
                type="color"
                value={cardBorderColor}
                onChange={(e) => setCardBorderColor(e.target.value)}
                style={{ width: "100%", height: "30px", padding: "0" }}
              />
            </div>
            {/* Link Text & Content Styling */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Font Family:
              </label>
              <select
                value={linkFontFamily}
                onChange={(e) => setLinkFontFamily(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Font Weight:
              </label>
              <select
                value={linkFontWeight}
                onChange={(e) => setLinkFontWeight(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="100">100</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="600">600</option>
                <option value="700">700</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Font Color:
              </label>
              <input
                type="color"
                value={linkFontColor}
                onChange={(e) => setLinkFontColor(e.target.value)}
                style={{ width: "100%", height: "30px", padding: "0" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Font Size: {linkFontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="36"
                value={linkFontSize}
                onChange={(e) => setLinkFontSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Text Position:
              </label>
              <select
                value={linkTextPosition}
                onChange={(e) => setLinkTextPosition(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Link Background Color:
              </label>
              <input
                type="color"
                value={linkBackgroundColor}
                onChange={(e) => setLinkBackgroundColor(e.target.value)}
                style={{ width: "100%", height: "30px", padding: "0" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Link Padding: {linkPadding}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={linkPadding}
                onChange={(e) => setLinkPadding(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            {/* Full-Page Background Controls */}
            <div style={{ marginBottom: "10px" }}>
              <h4 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "6px" }}>Background</h4>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                  Background Color:
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: "100%", height: "30px", padding: "0" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                  Background Gradient:
                </label>
                <select
                  value={bgGradient}
                  onChange={(e) => setBgGradient(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  <option value="">None</option>
                  <option value="linear-gradient(45deg, #ff6b6b, #f06595)">Sunset</option>
                  <option value="linear-gradient(45deg, #74c0fc, #4dabf7)">Skyline</option>
                  <option value="linear-gradient(45deg, #a9e34b, #74c69d)">Mint</option>
                  <option value="linear-gradient(45deg, #f59f00, #f76707)">Orange Burst</option>
                  <option value="linear-gradient(45deg, #845ef7, #5c7cfa)">Violet Haze</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                  Background Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                  Background Video (YouTube link):
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://youtu.be/VIDEO_ID"
                  value={bgVideo}
                  onChange={(e) => setBgVideo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Masonry / Grid Container */}
      <div style={containerStyle} className="w-full">
        {loading && <p style={{ color: "#aaa", textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {searchResults.map((item, index) => (
          <div key={index} style={cardStyle} className="relative break-inside-avoid">
            {item.link && (
              <img
                src={item.link}
                alt={item.title}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            )}
            <div style={overlayDivStyle} className="relative z-10 flex items-center">
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.image && item.image.contextLink && (
                  <img
                    src={getFaviconUrl(item.image.contextLink)}
                    alt="favicon"
                    style={{ width: "16px", height: "16px", marginRight: "4px" }}
                  />
                )}
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Your API keys (from previous conversations)
const API_KEY = "AIzaSyDlc54LBF2pEDWQiC7JUG7kB5PaFsoytAE";
const SEARCH_ENGINE_ID = "615b8aae2d40343b8";

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  // --- Search State ---
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Mobile Detection (viewport < 700px) ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Style Control Panel States ---
  // Grid layout: "masonry-vertical", "simple-grid", "masonry-horizontal"
  const [gridLayout, setGridLayout] = useState("masonry-vertical");
  // For non‑vertical layouts:
  const [linkCardWidth, setLinkCardWidth] = useState(250);
  const [linkCardHeight, setLinkCardHeight] = useState(250);
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

  // Full‑page background styling
  const [bgColor, setBgColor] = useState("#111111");
  const [bgGradient, setBgGradient] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const [bgVideo, setBgVideo] = useState("");

  // Theme preset selection
  const [selectedTheme, setSelectedTheme] = useState("");

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
        // Filter: only include items with an image & remove duplicate image links
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

  // --- YouTube Background Embed Functions ---
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

  // --- Theme Preset Function ---
  function applyTheme(theme) {
    if (theme === "Minimal") {
      setCardBorderWidth(0);
      setCardBorderRadius(0);
      setLinkFontFamily("Arial, sans-serif");
      setLinkFontWeight("400");
      setLinkFontColor("#ffffff");
      setLinkFontSize(14);
      setLinkBackgroundColor("rgba(0,0,0,0.4)");
      setBgColor("#111111");
      setBgGradient("");
    } else if (theme === "Vibrant") {
      setCardBorderWidth(2);
      setCardBorderRadius(8);
      setLinkFontFamily("'Helvetica Neue', sans-serif");
      setLinkFontWeight("600");
      setLinkFontColor("#ff4081");
      setLinkFontSize(16);
      setLinkBackgroundColor("rgba(0,0,0,0.5)");
      setBgColor("#000000");
      setBgGradient("linear-gradient(45deg, #ff6b6b, #f06595)");
    } else if (theme === "Elegant") {
      setCardBorderWidth(1);
      setCardBorderRadius(4);
      setLinkFontFamily("'Times New Roman', serif");
      setLinkFontWeight("400");
      setLinkFontColor("#333333");
      setLinkFontSize(15);
      setLinkBackgroundColor("rgba(255,255,255,0.7)");
      setBgColor("#f7f7f7");
      setBgGradient("");
    } else if (theme === "Neon") {
      setCardBorderWidth(2);
      setCardBorderRadius(0);
      setLinkFontFamily("Arial, sans-serif");
      setLinkFontWeight("700");
      setLinkFontColor("#39ff14");
      setLinkFontSize(18);
      setLinkBackgroundColor("rgba(0,0,0,0.7)");
      setBgColor("#000000");
      setBgGradient("linear-gradient(45deg, #ff00ff, #00ffff)");
    } else if (theme === "Nature") {
      setCardBorderWidth(1);
      setCardBorderRadius(4);
      setLinkFontFamily("Verdana, sans-serif");
      setLinkFontWeight("400");
      setLinkFontColor("#2e7d32");
      setLinkFontSize(15);
      setLinkBackgroundColor("rgba(255,255,255,0.6)");
      setBgColor("#e8f5e9");
      setBgGradient("");
    } else {
      // Default/reset theme
      setCardBorderWidth(0);
      setCardBorderRadius(0);
      setLinkFontFamily("Arial, sans-serif");
      setLinkFontWeight("400");
      setLinkFontColor("#ffffff");
      setLinkFontSize(14);
      setLinkBackgroundColor("rgba(0,0,0,0.4)");
      setBgColor("#111111");
      setBgGradient("");
    }
  }

  // When theme preset changes, apply it
  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  // --- Dynamic Styles ---

  // Full‑page background style
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
    paddingTop: "70px", // leave room for top‑left search input
  };

  // Container style for results:
  // For "masonry-vertical", use CSS columns (1 column on mobile, 3 on desktop);
  // For "simple-grid", use grid;
  // For "masonry-horizontal", use flex.
  let containerStyle;
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

  // Card style – for masonry vertical, we let images retain natural aspect ratio.
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

  // Overlay style for link text and action icons
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

  // Helper: get favicon URL using Google's service
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

      {/* Search Input (Top-Left) */}
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

      {/* Style Control Panel Dropdown Toggle (Gear Icon at Top-Right) */}
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

            {/* --- Theme Presets --- */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "14px", marginBottom: "4px", display: "block" }}>
                Theme Presets:
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value);
                  applyTheme(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "6px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">Default</option>
                <option value="Minimal">Minimal</option>
                <option value="Vibrant">Vibrant</option>
                <option value="Elegant">Elegant</option>
                <option value="Neon">Neon</option>
                <option value="Nature">Nature</option>
              </select>
            </div>

            {/* --- Grid Layout & Dimensions --- */}
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
            {/* --- Card Border Styling --- */}
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
            {/* --- Link Text & Content Styling --- */}
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
            {/* --- Full‑Page Background Controls --- */}
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

      {/* Masonry / Grid Container for Results */}
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
              {/* Action Icons: Edit, Delete, Move */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => console.log("Edit card", index)}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 2.487a2.25 2.25 0 113.182 3.182L7.136 18.578a4.5 4.5 0 01-1.892 1.131l-2.835.945.945-2.835a4.5 4.5 0 011.131-1.892l12.377-12.44z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const updated = [...searchResults];
                    updated.splice(index, 1);
                    setSearchResults(updated);
                  }}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    style={{ width: "20px", height: "20px", color: "red" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l.45 8.25m4.5-8.25l-.45 8.25M6.75 5.25h10.5"
                    />
                  </svg>
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  style={{ width: "20px", height: "20px", cursor: "move" }}
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
        ))}
      </div>
    </div>
  );
}

function applyTheme(theme) {
  // Update style states based on the chosen theme preset
  if (theme === "Minimal") {
    // Minimal: default no border, basic dark theme
    // (Reset to defaults)
    // These setters must be available via closures in the component—
    // In this example, useEffect above calls applyTheme when selectedTheme changes.
  } else if (theme === "Vibrant") {
    // Vibrant theme preset
  } else if (theme === "Elegant") {
    // Elegant theme preset
  } else if (theme === "Neon") {
    // Neon theme preset
  } else if (theme === "Nature") {
    // Nature theme preset
  }
  // For brevity in this snippet, the actual setter calls are handled within the component's useEffect.
}

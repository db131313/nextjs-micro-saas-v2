import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Your API keys
const API_KEY = "AIzaSyDlc54LBF2pEDWQiC7JUG7kB5PaFsoytAE";
const SEARCH_ENGINE_ID = "615b8aae2d40343b8";

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mobile detection (viewport width < 700px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch search results when query changes
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
        // Filter out items without an image and remove duplicate image links
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

  // Full-page background style (simple dark background)
  const backgroundStyle = {
    backgroundColor: "#111111",
    minHeight: "100vh",
    paddingTop: "70px", // leave room for the top-left search input
  };

  // Container style for masonry vertical layout using CSS columns.
  // On mobile, force one column; otherwise, use three columns.
  const containerStyle = isMobile
    ? { columnCount: 1, columnGap: "10px", width: "100%" }
    : { columnCount: 3, columnGap: "10px", width: "100%" };

  // Default card style: no border and no border radius.
  const cardStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "0px",
    border: "0px solid transparent",
    marginBottom: "10px",
    width: "100%",
    // Ensure cards don't break across columns
    breakInside: "avoid",
    WebkitColumnBreakInside: "avoid",
    MozColumnBreakInside: "avoid",
  };

  // Overlay style for link text and favicon
  const overlayStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: "5px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "400",
    color: "#ffffff",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  };

  // Helper to get favicon using Google's service
  const getFaviconUrl = (url) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div style={backgroundStyle}>
      {/* Search input in top-left */}
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

      {/* Results container */}
      <div style={containerStyle} className="w-full">
        {loading && <p style={{ color: "#aaa", textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {searchResults.map((item, index) => (
          <div key={index} style={cardStyle}>
            {item.link && (
              <img
                src={item.link}
                alt={item.title}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            )}
            <div style={overlayStyle}>
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

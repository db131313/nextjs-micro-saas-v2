import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/results?query=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Search the Web</h1>
      <p className="mb-6">Enter a keyword to find relevant links</p>
      <input 
        type="text" 
        placeholder="Enter keyword..." 
        value={keyword} 
        onChange={(e) => setKeyword(e.target.value)} 
        className="p-2 text-black rounded mb-4 w-64 text-center"
      />
      <button 
        onClick={handleSearch} 
        className="px-4 py-2 bg-white text-blue-600 font-bold rounded disabled:opacity-50" 
        disabled={!keyword.trim()}
      >
        Search
      </button>
    </div>
  );
}

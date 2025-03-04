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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <input 
        type="text" 
        placeholder="Enter keyword..." 
        value={keyword} 
        onChange={(e) => setKeyword(e.target.value)} 
        className="w-full max-w-md p-4 border border-gray-300 rounded-lg mb-4"
      />
      <button 
        onClick={handleSearch} 
        className="w-full max-w-md bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
}

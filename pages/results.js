import { useRouter } from 'next/router';

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  // Example data - in real implementation, this will come from an API or database
  const searchResults = [
    { id: 1, title: "Example Link 1", url: "#" },
    { id: 2, title: "Example Link 2", url: "#" },
    { id: 3, title: "Example Link 3", url: "#" },
    { id: 4, title: "Example Link 4", url: "#" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="mb-6">Results for: <strong>{query || 'No keyword provided'}</strong></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {searchResults.map((result) => (
          <a key={result.id} href={result.url} className="flex items-center justify-center h-40 bg-white text-black font-bold rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1">
            {result.title}
          </a>
        ))}
      </div>

      <button 
        onClick={() => router.push('/')} 
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
      >
        Back to Search
      </button>
    </div>
  );
}


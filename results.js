import { useRouter } from 'next/router';

export default function Results() {
  const router = useRouter();
  const { query } = router.query;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Search Results</h1>
      <p className="mb-6">Results for: <strong>{query}</strong></p>
      <button 
        onClick={() => router.push('/')} 
        className="px-4 py-2 bg-white text-blue-600 font-bold rounded"
      >
        Back to Search
      </button>
    </div>
  );
}

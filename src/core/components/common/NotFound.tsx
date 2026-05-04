import { Search, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">404 error</p>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Page not found.
        </h1>
        <p className="mt-4 text-base text-gray-500 max-w-sm mx-auto">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL?
        </p>
        
        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link
            to="/support"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Optional: Visual element */}
      <div className="mt-12 opacity-10">
        <Search size={200} />
      </div>
    </div>
  );
};
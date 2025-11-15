import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-6 bg-slate-950 text-white">
      <div className="relative flex items-center justify-center">
        <h1 className="text-[12rem] sm:text-[16rem] md:text-[20rem] font-black text-white/5 leading-none select-none">
          404
        </h1>
        <div className="absolute flex flex-col items-center">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-normal
                       bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text"
          >
            Page Not Found
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-sm">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3 px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-cyan-700 transform transition-all duration-300"
        >
          <Home className="h-5 w-5" />
          <span>Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

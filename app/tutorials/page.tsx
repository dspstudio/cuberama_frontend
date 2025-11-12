import Link from 'next/link';
import { Clock, BarChart3 } from 'lucide-react';
import { mockTutorials } from './data';

export default function TutorialsPage() {
  return (
    <div className="bg-slate-950/70 min-h-screen text-white">
      <main className="container mx-auto px-6 py-24 sm:py-32">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome to the Cuberama Academy</h1>
          <p className="mt-6 text-lg text-gray-400">
            From beginner basics to advanced techniques, our tutorials are here to help you master every aspect of our powerful 3D editor.
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTutorials.map((tutorial) => (
            <Link href={`/tutorials/${tutorial.slug}`} key={tutorial.slug}>
              <div className="group bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
                  <tutorial.Icon className="w-16 h-16 text-white/50 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-600/50 text-blue-300 rounded-full">{tutorial.category}</span>
                    <h2 className="mt-4 text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">{tutorial.title}</h2>
                    <p className="mt-2 text-sm text-gray-400">{tutorial.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      <span>{tutorial.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
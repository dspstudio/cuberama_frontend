import Link from 'next/link';
import { Clock, BarChart3 } from 'lucide-react';
import { mockTutorials } from '../data';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tutorial = mockTutorials.find(t => t.slug === resolvedParams.slug);

  if (!tutorial) {
    return {
      title: 'Tutorial not found',
      description: 'The requested tutorial could not be found.',
    };
  }

  return {
    title: tutorial.title,
    description: tutorial.description,
    keywords: tutorial.keywords,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      images: [{ url: tutorial.ogImage || '/opengraph-image.jpg' }], // Fallback image
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cuberama.app'}/tutorials/${tutorial.slug}`, // Use a dynamic canonical URL
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cuberama.app'}/tutorials/${tutorial.slug}`, // Use a dynamic canonical URL
    },
  };
}


export default async function TutorialPage({ params }: Props) {
  // Await the params object if it's a Promise before accessing its properties
  const resolvedParams = await params;
  const tutorial = mockTutorials.find(t => t.slug === resolvedParams.slug);
  const otherTutorials = mockTutorials.filter(t => t.slug !== resolvedParams.slug);

  if (!tutorial) {
    return (
      <div className="bg-slate-950/70 min-h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Tutorial not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/70 min-h-screen text-white">
      <main className="container mx-auto px-6 py-16 sm:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-6">
              <p className="text-gray-500">Video Player Placeholder</p>
            </div>

            {/* Tutorial Header */}
            <div className="mb-8">
              <span className="text-sm font-semibold px-2.5 py-1 bg-blue-600/50 text-blue-300 rounded-full">{tutorial.category}</span>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">{tutorial.title}</h1>
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
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

            {/* Tutorial Body */}
            <div className="prose prose-invert prose-lg max-w-none">
              <p>{tutorial.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.
                Nullam euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              <h2>Key Steps</h2>
              <ol>
                <li>First, open the animation panel.</li>
                <li>Next, import your 3D model.</li>
                <li>Then, apply the AI-powered animation preset.</li>
                <li>Finally, tweak the keyframes on the timeline for the perfect result.</li>
              </ol>
              <p>
                Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Proin eget tortor risus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="sticky top-24 p-6 bg-slate-900 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Up Next</h3>
              <ul className="space-y-4">
                {otherTutorials.slice(0, 4).map(next => (
                  <li key={next.slug}>
                    <Link href={`/tutorials/${next.slug}`}>
                      <div className="group flex items-start gap-4">
                        <div className="flex-shrink-0 h-16 w-16 bg-slate-800 rounded-md flex items-center justify-center">
                          <next.Icon className="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-blue-400 transition-colors duration-200">{next.title}</h4>
                          <p className="text-xs text-gray-500">{next.duration}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

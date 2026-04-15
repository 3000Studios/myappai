import VideoBackground from '@/components/VideoBackground';
import Link from 'next/link';
import Card from '../ui/Card';

export const metadata = {
  title: 'Apps - 3000 Studios',
  description: 'AI-Powered Applications by 3000 Studios',
};

export default function AppsPage() {
  const apps = [
    {
      name: '3000 Studios Sound Amp',
      href: 'https://ai.studio/apps/drive/16gUD8hBDhQL7BSq9V_fHOPM5xAeIJtHE?fullscreenApplet=true',
      description: 'Enhance your audio experience with AI-powered amplification.',
    },
    {
      name: '3000 FM',
      href: 'https://ai.studio/apps/drive/1T_77lTBIyjLzMyvnJGUHZ2nUnqs4qcGM?',
      description: 'Your personal AI radio station and music discovery platform.',
    },
    {
      name: '3000 Studios Auto Video Editor',
      href: 'https://ai.studio/apps/drive/1OJdfbOG0jyOIrKqTM3HaHyStzHQosUHw?fullscreenApplet=truefullscreenApplet=true',
      description: 'Professional video editing powered by intelligent automation.',
    },
    {
      name: '3000 Site Builder Pro',
      href: 'https://ai.studio/apps/drive/1NXX4PEelbMSaXHwmNuMlqUY9bd5-Wq6o',
      description: 'Create stunning websites in minutes with our advanced builder.',
    },
    {
      name: '3000 Studios Youtube Downloader',
      href: 'https://ai.studio/apps/drive/1NA6S6o46gHgNWWhxDoQFF29z3vHtzoXq?fullscreenApplet=true',
      description: 'Download and manage YouTube content efficiently.',
    },
    {
      name: 'AI Automation Toolkit',
      href: '/apps/ai-automation-toolkit',
      description: 'Streamline your workflows with intelligent automation',
    },
  ];

  return (
    <div className="min-h-screen relative pt-32 pb-20 px-4">
      <VideoBackground
        src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986180/lime_green_zd7xgt.mp4"
        opacity={0.3}
      />

      {/* Premium Section Divider */}
      <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 shadow-[0_0_10px_#D4AF37]" />

      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-5xl font-bold text-center mb-4 bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Our Applications
        </h1>
        <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Explore our suite of AI-powered applications designed to enhance your productivity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <Link key={app.href} href={app.href}>
              <Card
                gradient
                className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">{app.name}</h3>
                <p className="text-gray-300">{app.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


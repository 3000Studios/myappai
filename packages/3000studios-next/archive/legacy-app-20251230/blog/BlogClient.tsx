'use client';

import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
}

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://3000studios.com/wp-json/wp/v2/posts?per_page=6&_embed')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-2 border-hologram border-t-transparent rounded-full animate-spin"></div>
          <p className="font-sans text-xs tracking-widest text-platinum/50">RECEIVING DATA...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post, index) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hyper-glass p-8 rounded-sm group hover:border-hologram/30 transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
                <h2
                  className="font-display text-3xl text-white group-hover:text-hologram transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <span className="font-sans text-xs text-platinum/40 tracking-widest shrink-0">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>

              <div
                className="font-sans text-sm text-platinum/60 leading-relaxed font-light max-w-3xl"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />

              <div className="mt-6 flex items-center gap-2 text-xs font-sans tracking-widest text-hologram opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                READ TRANSMISSION <span>→</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 hyper-glass rounded-sm">
          <p className="font-sans text-platinum/50 tracking-widest">NO TRANSMISSIONS FOUND</p>
        </div>
      )}
    </div>
  );
}


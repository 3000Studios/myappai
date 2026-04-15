/**
 * Content Generator Component
 * AI-powered content creation for blogs and products
 */

'use client';

import { useState } from 'react';
import { FileText, Package, Wand2, Loader2, CheckCircle } from 'lucide-react';
import { useContentGeneration } from '@/hooks/useAPI';

export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState<'blog' | 'product'>('blog');
  const [blogTopic, setBlogTopic] = useState('');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [productName, setProductName] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [success, setSuccess] = useState(false);

  const { generateBlog, generateProductDescription, loading, error } = useContentGeneration();

  const handleGenerateBlog = async () => {
    if (!blogTopic.trim()) return;

    setSuccess(false);
    try {
      const keywords = blogKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      const result = await generateBlog(blogTopic, keywords, true);
      setGeneratedContent(result.fullContent);
      setSuccess(true);

      if (result.wordpressId) {
        alert(`Blog post saved to WordPress as draft! ID: ${result.wordpressId}`);
      }
    } catch (err: unknown) {
      console.error('', err);
    }
  };

  const handleGenerateProduct = async () => {
    if (!productName.trim()) return;

    setSuccess(false);
    try {
      const features = productFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);
      const result = await generateProductDescription(productName, features);
      setGeneratedContent(result.description);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('', err);
    }
  };

  return (
    <div className="card bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-500">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Wand2 className="text-indigo-400" size={24} />
        AI Content Generator
      </h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'blog'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <FileText size={20} />
          Blog Posts
        </button>
        <button
          onClick={() => setActiveTab('product')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'product'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <Package size={20} />
          Product Descriptions
        </button>
      </div>

      {/* Blog Generator */}
      {activeTab === 'blog' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Blog Topic</label>
            <input
              type="text"
              value={blogTopic}
              onChange={(e) => setBlogTopic(e.target.value)}
              placeholder="e.g., The Future of Web Development"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={blogKeywords}
              onChange={(e) => setBlogKeywords(e.target.value)}
              placeholder="e.g., React, Next.js, TypeScript"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerateBlog}
            disabled={loading || !blogTopic.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Blog Post
              </>
            )}
          </button>

          <p className="text-xs text-gray-500">✨ Will be saved to WordPress as draft for review</p>
        </div>
      )}

      {/* Product Generator */}
      {activeTab === 'product' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Premium Design Template Pack"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key Features (comma-separated)
            </label>
            <textarea
              value={productFeatures}
              onChange={(e) => setProductFeatures(e.target.value)}
              placeholder="e.g., 50+ templates, Fully responsive, Easy customization"
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={handleGenerateProduct}
            disabled={loading || !productName.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Description
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-400 text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          Content generated successfully!
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Generated Content:</h4>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}



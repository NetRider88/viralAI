import React from 'react';
import { Instagram, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PlatformPreviewProps {
  platform: string;
  caption: string;
  hashtags: string[];
  hook?: string;
  images?: string[];
}

export function PlatformPreview({ platform, caption, hashtags, hook, images }: PlatformPreviewProps) {
  const renderInstagramPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-200">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <Instagram className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">your_brand</p>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
        <button className="text-gray-600">•••</button>
      </div>

      {/* Image */}
      {images && images.length > 0 && images[0] && (
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <img src={images[0]} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}
      {(!images || images.length === 0) && (
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <Instagram className="w-16 h-16 text-purple-300" />
        </div>
      )}

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
          <button className="ml-auto hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <p className="text-sm font-semibold">1,234 likes</p>
        
        <div className="text-sm">
          <span className="font-semibold">your_brand</span>{' '}
          <span className="whitespace-pre-wrap">{caption.substring(0, 150)}{caption.length > 150 && '...'}</span>
        </div>

        {hashtags && hashtags.length > 0 && (
          <p className="text-sm text-blue-600">
            {hashtags.slice(0, 3).join(' ')}
          </p>
        )}

        <p className="text-xs text-gray-500 uppercase">2 hours ago</p>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border border-gray-300 max-w-xl mx-auto">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          YB
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Your Brand</p>
          <p className="text-xs text-gray-600">1,234 followers</p>
          <p className="text-xs text-gray-500">2h • 🌐</p>
        </div>
        <button className="text-gray-600">•••</button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm whitespace-pre-wrap">{caption}</p>
        {hashtags && hashtags.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            {hashtags.slice(0, 5).join(' ')}
          </p>
        )}
      </div>

      {/* Image */}
      {images && images.length > 0 && images[0] && (
        <img src={images[0]} alt="Post" className="w-full max-h-96 object-cover" />
      )}
      {(!images || images.length === 0) && (
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <Linkedin className="w-16 h-16 text-blue-300" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>👍 💡 🎉 234</span>
          <span>12 comments • 5 reposts</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm font-semibold">
          <span>👍</span> Like
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm font-semibold">
          <span>💬</span> Comment
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm font-semibold">
          <span>🔄</span> Repost
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm font-semibold">
          <span>📤</span> Send
        </button>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-2xl border border-gray-200 max-w-xl mx-auto p-4">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <Twitter className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">Your Brand</span>
            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-gray-500 text-sm">@yourbrand · 2h</span>
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap">{caption}</p>
          {hashtags && hashtags.length > 0 && (
            <p className="text-sm text-blue-500 mt-1">
              {hashtags.slice(0, 2).join(' ')}
            </p>
          )}
          {images && images.length > 0 && images[0] && (
            <img src={images[0]} alt="Tweet" className="mt-3 rounded-2xl w-full max-h-96 object-cover border border-gray-200" />
          )}
          <div className="flex items-center justify-between mt-3 text-gray-500 max-w-md">
            <button className="flex items-center gap-2 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs">42</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs">12</span>
            </button>
            <button className="flex items-center gap-2 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">234</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTikTokPreview = () => (
    <div className="bg-black rounded-2xl max-w-sm mx-auto overflow-hidden relative" style={{ aspectRatio: '9/16' }}>
      {/* Video Area */}
      <div className="absolute inset-0">
        {images && images.length > 0 && images[0] ? (
          <img src={images[0]} alt="TikTok" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">
            <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-white space-y-2">
          <p className="font-semibold">@yourbrand</p>
          <p className="text-sm line-clamp-3">{caption}</p>
          {hashtags && hashtags.length > 0 && (
            <p className="text-sm font-semibold">
              {hashtags.slice(0, 3).join(' ')}
            </p>
          )}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-300 mb-1"></div>
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">+</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-xs">234K</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span className="text-xs">1.2K</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          <span className="text-xs">567</span>
        </div>
      </div>
    </div>
  );

  const renderYouTubePreview = () => (
    <div className="bg-white rounded-lg max-w-2xl mx-auto overflow-hidden border border-gray-200">
      {/* Video Thumbnail */}
      {images && images.length > 0 && images[0] ? (
        <div className="relative aspect-video bg-black">
          <img src={images[0]} alt="YouTube" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            10:24
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
          <Youtube className="w-20 h-20 text-white" />
        </div>
      )}

      {/* Video Info */}
      <div className="p-3">
        <h3 className="font-semibold text-base line-clamp-2 mb-2">{caption.substring(0, 100)}</h3>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            YB
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Your Brand</p>
            <p className="text-xs text-gray-600">100K subscribers</p>
            <p className="text-xs text-gray-600 mt-1">12K views • 2 hours ago</p>
          </div>
        </div>
        {hashtags && hashtags.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            {hashtags.slice(0, 5).join(' ')}
          </p>
        )}
      </div>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="bg-white rounded-lg border border-gray-300 max-w-xl mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          YB
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Your Brand</p>
          <p className="text-xs text-gray-500">2h • 🌍</p>
        </div>
        <button className="text-gray-600">•••</button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm whitespace-pre-wrap">{caption}</p>
        {hashtags && hashtags.length > 0 && (
          <p className="text-sm text-blue-600 mt-2">
            {hashtags.slice(0, 3).join(' ')}
          </p>
        )}
      </div>

      {/* Image */}
      {images && images.length > 0 && images[0] ? (
        <img src={images[0]} alt="Facebook" className="w-full max-h-96 object-cover" />
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <Facebook className="w-16 h-16 text-blue-300" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>👍 ❤️ 😆 234</span>
          <span>12 comments • 5 shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded flex-1 justify-center">
          <span>👍</span> <span className="text-sm font-semibold">Like</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded flex-1 justify-center">
          <span>💬</span> <span className="text-sm font-semibold">Comment</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded flex-1 justify-center">
          <span>↗️</span> <span className="text-sm font-semibold">Share</span>
        </button>
      </div>
    </div>
  );

  switch (platform.toLowerCase()) {
    case 'instagram':
      return renderInstagramPreview();
    case 'tiktok':
      return renderTikTokPreview();
    case 'youtube':
      return renderYouTubePreview();
    case 'linkedin':
      return renderLinkedInPreview();
    case 'twitter':
    case 'x':
      return renderTwitterPreview();
    case 'facebook':
      return renderFacebookPreview();
    default:
      return (
        <Card className="p-6 max-w-xl mx-auto">
          <p className="text-sm text-gray-500 mb-3">Preview for {platform}</p>
          <p className="text-sm whitespace-pre-wrap">{caption}</p>
          {hashtags && hashtags.length > 0 && (
            <p className="text-sm text-blue-600 mt-2">{hashtags.join(' ')}</p>
          )}
        </Card>
      );
  }
}

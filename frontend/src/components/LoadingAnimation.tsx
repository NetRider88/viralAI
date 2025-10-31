'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Lightbulb, Pencil, Palette, Wand2, Brain, Zap } from 'lucide-react';

interface LoadingAnimationProps {
  type?: 'generating' | 'searching' | 'adapting';
  message?: string;
}

const generatingStages = [
  { icon: Brain, text: 'Thinking...', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { icon: Lightbulb, text: 'Getting ideas...', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { icon: Pencil, text: 'Writing content...', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { icon: Palette, text: 'Creating visuals...', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { icon: Wand2, text: 'Adding magic...', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { icon: Sparkles, text: 'Finalizing...', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
];

const searchingStages = [
  { icon: Brain, text: 'Analyzing...', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { icon: Zap, text: 'Processing...', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { icon: Lightbulb, text: 'Finding insights...', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { icon: Sparkles, text: 'Almost there...', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
];

const adaptingStages = [
  { icon: Brain, text: 'Understanding platform...', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { icon: Pencil, text: 'Adapting content...', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { icon: Wand2, text: 'Optimizing...', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { icon: Sparkles, text: 'Finishing up...', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
];

export function LoadingAnimation({ type = 'generating', message }: LoadingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  
  const stages = type === 'searching' ? searchingStages : type === 'adapting' ? adaptingStages : generatingStages;
  const stageDuration = type === 'searching' ? 1500 : 2000; // Faster for searching

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, stageDuration);

    return () => clearInterval(interval);
  }, [stages.length, stageDuration]);

  const CurrentIcon = stages[currentStage].icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        {/* Outer pulse ring */}
        <div className={`absolute inset-0 ${stages[currentStage].bgColor} rounded-full animate-ping opacity-75`} />
        
        {/* Middle ring */}
        <div className={`absolute inset-2 ${stages[currentStage].bgColor} rounded-full animate-pulse`} />
        
        {/* Icon container */}
        <div className={`relative ${stages[currentStage].bgColor} rounded-full p-6 shadow-lg`}>
          <CurrentIcon className={`h-12 w-12 ${stages[currentStage].color} animate-bounce`} />
        </div>
      </div>

      {/* Stage Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 animate-pulse">
          {stages[currentStage].text}
        </h3>
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-6">
        {stages.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStage
                ? `w-8 ${stages[currentStage].bgColor}`
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className={`h-4 w-4 ${stages[currentStage].color} opacity-40`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact inline loading for smaller spaces
export function InlineLoadingAnimation({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75" />
        <div className="relative bg-purple-100 rounded-full p-2">
          <Sparkles className="h-5 w-5 text-purple-600 animate-spin" />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 animate-pulse">{text}</span>
    </div>
  );
}

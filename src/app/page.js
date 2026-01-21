'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import CharacterSelector from '@/components/CharacterSelector';
import AttributeCarousel from '@/components/AttributeCarousel';
import PromptGenerator from '@/components/PromptGenerator';
import ChatBot from '@/components/ChatBot';

// Dynamically import the 3D background to avoid SSR issues
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0a0015] via-[#1a0030] to-[#0d001a]" />
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('generator');
  const [characterData, setCharacterData] = useState(null);
  const [attributes, setAttributes] = useState({});

  const handleCopyToPrompt = (text) => {
    setActiveTab('generator');
    console.log('Copying to prompt:', text);
  };

  return (
    <div className="min-h-screen relative">
      {/* WebGL Particle Background */}
      <ParticleBackground />

      {/* Header */}
      <header className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="gradient-text">CHARACTER</span>
            <br />
            <span className="text-white neon-text">GENERATOR</span>
            <span className="gradient-text ml-4">PRO</span>
          </h1>

          {/* Subtitle with glow */}
          <p className="text-lg md:text-xl text-gray-400 mb-2">
            Powered by <span className="text-[#ff00ff] neon-text">Groq AI</span> + <span className="text-[#00ffff] neon-text-cyan">Replicate Nano Banana</span>
          </p>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="status-dot online"></span>
            <span className="text-sm text-gray-500">AI Models Ready</span>
          </div>
        </div>
      </header>

      {/* Glowing Divider */}
      <div className="divider-glow mx-auto max-w-4xl"></div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('generator')}
            className={`tab-button flex items-center gap-2 ${activeTab === 'generator' ? 'active' : ''}`}
          >
            <span className="text-xl">🎨</span>
            <span>Image Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`tab-button flex items-center gap-2 ${activeTab === 'chatbot' ? 'active' : ''}`}
          >
            <span className="text-xl">💬</span>
            <span>Character Assistant</span>
          </button>
        </div>

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            {/* Instructions Card */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <span className="gradient-text">How to Use</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="badge badge-pink">1</span>
                  <p className="text-gray-300">Choose an <strong className="text-white">existing character</strong> or create a <strong className="text-white">new one</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="badge badge-cyan">2</span>
                  <p className="text-gray-300">Customize body attributes using the <strong className="text-white">carousel sliders</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="badge badge-purple">3</span>
                  <p className="text-gray-300">Click <strong className="text-white">&quot;Generate 4 Prompts&quot;</strong> for AI-optimized prompts</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="badge badge-pink">4</span>
                  <p className="text-gray-300">Generate images with <strong className="text-[#ff00ff]">Nano Banana Pro</strong> or <strong className="text-[#00ffff]">Regular</strong></p>
                </div>
              </div>
            </div>

            {/* Character Selection */}
            <div className="glass-card p-6 md:p-8">
              <CharacterSelector onCharacterSelect={setCharacterData} />
            </div>

            {/* Attribute Carousel */}
            {characterData && (
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-3xl font-bold text-center mb-6">
                  <span className="gradient-text">Customize Physical Attributes</span>
                </h2>
                <AttributeCarousel
                  gender={characterData.characterGender}
                  onAttributesChange={setAttributes}
                />
              </div>
            )}

            {/* Prompt Generator */}
            {characterData && (
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-3xl font-bold text-center mb-6">
                  <span className="gradient-text">Generate Prompts & Images</span>
                </h2>
                <PromptGenerator
                  characterData={characterData}
                  attributes={attributes}
                />
              </div>
            )}

            {/* Empty State */}
            {!characterData && (
              <div className="glass-card p-12 text-center float-animation">
                <div className="text-7xl mb-6">🎭</div>
                <p className="text-2xl text-gray-400 mb-2">Select a Character to Begin</p>
                <p className="text-gray-500">Choose from the database or create your own</p>
              </div>
            )}
          </div>
        )}

        {/* Chatbot Tab */}
        {activeTab === 'chatbot' && (
          <div className="glass-card p-6 md:p-8" style={{ minHeight: 'calc(100vh - 400px)' }}>
            <ChatBot onCopyToPrompt={handleCopyToPrompt} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 mt-12">
        <div className="divider-glow mx-auto max-w-4xl mb-8"></div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Built with <span className="text-[#ff00ff]">Next.js</span> • <span className="text-[#00ffff]">Groq AI</span> • <span className="text-[#8b5cf6]">Replicate</span> • <span className="text-[#4ecdc4]">Neon DB</span>
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Database includes 1000+ characters from TV shows, anime & movies (1980-2025)
          </p>
        </div>
      </footer>
    </div>
  );
}

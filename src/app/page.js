'use client';

import { useState } from 'react';
import CharacterSelector from '@/components/CharacterSelector';
import AttributeCarousel from '@/components/AttributeCarousel';
import PromptGenerator from '@/components/PromptGenerator';
import ChatBot from '@/components/ChatBot';

export default function Home() {
  const [activeTab, setActiveTab] = useState('generator');
  const [characterData, setCharacterData] = useState(null);
  const [attributes, setAttributes] = useState({});

  const handleCopyToPrompt = (text) => {
    // Switch to generator tab and potentially populate fields
    setActiveTab('generator');
    // You could parse the text to extract character names if needed
    console.log('Copying to prompt:', text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Character Generator Pro
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Powered by Groq AI + Replicate Nano Banana
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🎨 Generator
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'chatbot'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            💬 Character Assistant
          </button>
        </div>

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">How to Use</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Choose an <strong>existing character</strong> from the database or create a <strong>new character</strong></li>
                <li>Customize body attributes using the <strong>carousel sliders</strong> below</li>
                <li>Click <strong>&quot;Generate 4 Prompts&quot;</strong> to create AI-optimized prompts with Groq</li>
                <li>Generate images using <strong>Nano Banana Pro</strong> or <strong>Regular</strong> models</li>
                <li>Use the <strong>Character Assistant</strong> tab to search for character names</li>
              </ol>
            </div>

            {/* Character Selection */}
            <CharacterSelector onCharacterSelect={setCharacterData} />

            {/* Attribute Carousel */}
            {characterData && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white text-center">
                  Customize Physical Attributes
                </h2>
                <AttributeCarousel
                  gender={characterData.characterGender}
                  onAttributesChange={setAttributes}
                />
              </div>
            )}

            {/* Prompt Generator */}
            {characterData && (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white text-center">
                  Generate Prompts & Images
                </h2>
                <PromptGenerator
                  characterData={characterData}
                  attributes={attributes}
                />
              </div>
            )}

            {!characterData && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👆</div>
                <p className="text-xl text-gray-400">
                  Start by selecting or creating a character above
                </p>
              </div>
            )}
          </div>
        )}

        {/* Chatbot Tab */}
        {activeTab === 'chatbot' && (
          <div className="max-w-4xl mx-auto" style={{ height: 'calc(100vh - 300px)' }}>
            <ChatBot onCopyToPrompt={handleCopyToPrompt} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>Built with Next.js, Groq AI, Replicate & Neon Database</p>
          <p className="text-sm mt-2">
            Database includes characters from TV shows, anime & movies (1980-2025)
          </p>
        </div>
      </footer>
    </div>
  );
}

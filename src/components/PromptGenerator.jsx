'use client';

import { useState } from 'react';

export default function PromptGenerator({ characterData, attributes }) {
  const [prompts, setPrompts] = useState(['', '', '', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingImages, setGeneratingImages] = useState([false, false, false, false]);
  const [generatedImages, setGeneratedImages] = useState([null, null, null, null]);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generatePrompts = async () => {
    if (!characterData.characterName && !characterData.newCharacterDescription) {
      setError('Please select or create a character first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const promptPromises = Array(4).fill(null).map(async (_, index) => {
        const response = await fetch('/api/generate-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterData,
            attributes: { ...attributes, variation: index + 1 },
          }),
        });
        const data = await response.json();
        return data.prompt;
      });

      const newPrompts = await Promise.all(promptPromises);
      setPrompts(newPrompts);
    } catch (err) {
      console.error('Error generating prompts:', err);
      setError('Failed to generate prompts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (promptIndex, modelType) => {
    if (!prompts[promptIndex]) {
      setError('Generate prompts first');
      return;
    }

    const newGeneratingImages = [...generatingImages];
    newGeneratingImages[promptIndex] = true;
    setGeneratingImages(newGeneratingImages);
    setError('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompts[promptIndex],
          modelType,
          aspectRatio: '4:3',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newGeneratedImages = [...generatedImages];
        newGeneratedImages[promptIndex] = data.images[0];
        setGeneratedImages(newGeneratedImages);
      } else {
        setError(`Failed to generate image: ${data.error}`);
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      const newGeneratingImages = [...generatingImages];
      newGeneratingImages[promptIndex] = false;
      setGeneratingImages(newGeneratingImages);
    }
  };

  const copyPrompt = (prompt, index) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generatePrompts}
          disabled={isGenerating}
          className={`group relative px-10 py-5 rounded-2xl font-bold text-lg transition-all ${
            isGenerating
              ? 'bg-[rgba(139,92,246,0.3)] text-gray-400 cursor-not-allowed'
              : 'neon-button-primary hover:scale-105'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Prompts with Groq AI...</span>
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span>Generate 4 Prompts with Groq</span>
            </span>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-[rgba(239,68,68,0.2)] border border-red-500/50 text-red-300 px-6 py-4 rounded-xl flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            className="prompt-card group"
          >
            {/* Prompt Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                  prompt
                    ? 'bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] text-white'
                    : 'bg-[rgba(139,92,246,0.3)] text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <h3 className="text-xl font-bold text-white">Prompt {index + 1}</h3>
              </div>
              {prompt && (
                <button
                  onClick={() => copyPrompt(prompt, index)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    copiedIndex === index
                      ? 'bg-[#4ecdc4] text-white'
                      : 'bg-[rgba(139,92,246,0.3)] text-white hover:bg-[rgba(255,0,255,0.3)]'
                  }`}
                >
                  {copiedIndex === index ? (
                    <>✓ Copied!</>
                  ) : (
                    <>📋 Copy</>
                  )}
                </button>
              )}
            </div>

            {/* Prompt Display */}
            {prompt ? (
              <div className="mb-5 p-4 bg-[rgba(10,0,21,0.6)] rounded-xl border border-[rgba(139,92,246,0.2)] text-gray-300 text-sm max-h-48 overflow-y-auto leading-relaxed">
                {prompt}
              </div>
            ) : (
              <div className="mb-5 p-6 bg-[rgba(10,0,21,0.4)] rounded-xl border border-dashed border-[rgba(139,92,246,0.3)] text-gray-500 text-sm text-center">
                <span className="text-2xl block mb-2">💭</span>
                Prompt will appear here...
              </div>
            )}

            {/* Image Generation Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => generateImage(index, 'pro')}
                disabled={!prompt || generatingImages[index]}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  !prompt || generatingImages[index]
                    ? 'bg-[rgba(139,92,246,0.2)] text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[rgba(255,0,255,0.3)]'
                }`}
              >
                {generatingImages[index] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>🍌</span>
                    <span>Pro (2K)</span>
                  </>
                )}
              </button>
              <button
                onClick={() => generateImage(index, 'regular')}
                disabled={!prompt || generatingImages[index]}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  !prompt || generatingImages[index]
                    ? 'bg-[rgba(0,255,255,0.2)] text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00ffff] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-[rgba(0,255,255,0.3)]'
                }`}
              >
                {generatingImages[index] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>🍌</span>
                    <span>Regular (1K)</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Image Display */}
            {generatedImages[index] && (
              <div className="mt-5 image-glow">
                <img
                  src={generatedImages[index]}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-auto"
                />
                <div className="bg-[rgba(10,0,21,0.8)] p-3 flex justify-between items-center">
                  <a
                    href={generatedImages[index]}
                    download={`character-${index + 1}.png`}
                    className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white text-sm rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    💾 Download
                  </a>
                  <a
                    href={generatedImages[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-[#00ffff] to-[#3b82f6] text-white text-sm rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    🔍 Full Size
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

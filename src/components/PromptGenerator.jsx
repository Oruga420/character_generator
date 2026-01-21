'use client';

import { useState } from 'react';

export default function PromptGenerator({ characterData, attributes }) {
  const [prompts, setPrompts] = useState(['', '', '', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingImages, setGeneratingImages] = useState([false, false, false, false]);
  const [generatedImages, setGeneratedImages] = useState([null, null, null, null]);
  const [error, setError] = useState('');

  const generatePrompts = async () => {
    if (!characterData.characterName && !characterData.newCharacterDescription) {
      setError('Please select or create a character first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Generate 4 different prompts with slight variations
      const promptPromises = Array(4).fill(null).map(async (_, index) => {
        const response = await fetch('/api/generate-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterData,
            attributes: {
              ...attributes,
              // Add slight variation for each prompt
              variation: index + 1,
            },
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

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generatePrompts}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? (
            <span className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Prompts...</span>
            </span>
          ) : (
            '✨ Generate 4 Prompts with Groq'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl"
          >
            {/* Prompt Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Prompt {index + 1}</h3>
              {prompt && (
                <button
                  onClick={() => copyPrompt(prompt)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                >
                  📋 Copy
                </button>
              )}
            </div>

            {/* Prompt Display */}
            {prompt ? (
              <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-300 text-sm max-h-48 overflow-y-auto">
                {prompt}
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-700 text-gray-500 text-sm text-center italic">
                Prompt will appear here...
              </div>
            )}

            {/* Image Generation Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => generateImage(index, 'pro')}
                disabled={!prompt || generatingImages[index]}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
              >
                {generatingImages[index] ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </span>
                ) : (
                  '🍌 Generate with Nano Banana Pro'
                )}
              </button>
              <button
                onClick={() => generateImage(index, 'regular')}
                disabled={!prompt || generatingImages[index]}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
              >
                {generatingImages[index] ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </span>
                ) : (
                  '🍌 Generate with Nano Banana Regular'
                )}
              </button>
            </div>

            {/* Generated Image Display */}
            {generatedImages[index] && (
              <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={generatedImages[index]}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-auto"
                />
                <div className="bg-gray-900 p-2 flex justify-between">
                  <a
                    href={generatedImages[index]}
                    download={`character-${index + 1}.png`}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded transition-colors"
                  >
                    💾 Download
                  </a>
                  <a
                    href={generatedImages[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                  >
                    🔍 View Full Size
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

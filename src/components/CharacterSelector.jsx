'use client';

import { useState, useEffect, useRef } from 'react';

export default function CharacterSelector({ onCharacterSelect }) {
  const [isNewCharacter, setIsNewCharacter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const [characterData, setCharacterData] = useState({
    isNewCharacter: false,
    characterName: '',
    characterShow: '',
    characterGender: 'Fem',
    newCharacterDescription: '',
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/characters/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.characters || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const data = { ...characterData, isNewCharacter };
    onCharacterSelect?.(data);
  }, [characterData, isNewCharacter]);

  const handleSelectCharacter = (character) => {
    setCharacterData({
      isNewCharacter: false,
      characterName: character.Character,
      characterShow: character.Show,
      characterGender: character.Gender,
      newCharacterDescription: '',
    });
    setSearchQuery(character.Character);
    setShowResults(false);
    setIsNewCharacter(false);
  };

  const handleModeSwitch = (newMode) => {
    setIsNewCharacter(newMode);
    setSearchQuery('');
    setSearchResults([]);
    setCharacterData({
      isNewCharacter: newMode,
      characterName: '',
      characterShow: '',
      characterGender: 'Fem',
      newCharacterDescription: '',
    });
  };

  return (
    <div className="w-full">
      {/* Section Title */}
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="text-3xl">🎭</span>
        <span className="gradient-text">Select Character</span>
      </h3>

      {/* Mode Toggle */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleModeSwitch(false)}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
            !isNewCharacter
              ? 'neon-button-primary'
              : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] text-gray-400 hover:text-white hover:border-[rgba(139,92,246,0.5)]'
          }`}
        >
          <span className="text-xl">📺</span>
          <span>Existing Character</span>
        </button>
        <button
          onClick={() => handleModeSwitch(true)}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
            isNewCharacter
              ? 'neon-button-secondary'
              : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] text-gray-400 hover:text-white hover:border-[rgba(139,92,246,0.5)]'
          }`}
        >
          <span className="text-xl">✨</span>
          <span>New Character</span>
        </button>
      </div>

      {/* Existing Character Search */}
      {!isNewCharacter && (
        <div className="space-y-4" ref={searchRef}>
          <label className="block text-white font-semibold mb-2 flex items-center gap-2">
            <span className="text-[#00ffff]">🔍</span>
            Search Database
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Type character name or show..."
              className="neon-input pr-12"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-[#ff00ff] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full max-w-[calc(100%-3rem)] glass-card mt-2 max-h-80 overflow-y-auto">
              {searchResults.map((char, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCharacter(char)}
                  className="w-full px-5 py-4 text-left hover:bg-[rgba(255,0,255,0.1)] transition-all border-b border-[rgba(139,92,246,0.2)] last:border-b-0 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold group-hover:text-[#ff00ff] transition-colors">
                        {char.Character}
                      </div>
                      <div className="text-sm text-gray-400">{char.Show}</div>
                    </div>
                    <span className={`badge ${char.Gender === 'Fem' ? 'badge-pink' : 'badge-cyan'}`}>
                      {char.Gender}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Character Display */}
          {characterData.characterName && (
            <div className="mt-6 p-5 bg-[rgba(255,0,255,0.1)] rounded-xl border border-[rgba(255,0,255,0.3)] shadow-lg shadow-[rgba(255,0,255,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#00ffff] mb-1">Selected Character</div>
                  <div className="text-2xl font-bold text-white neon-text">{characterData.characterName}</div>
                  <div className="text-gray-400 mt-1">from <span className="text-[#8b5cf6]">{characterData.characterShow}</span></div>
                </div>
                <span className={`px-5 py-2 rounded-full font-semibold text-sm ${
                  characterData.characterGender === 'Fem'
                    ? 'bg-[rgba(255,0,255,0.3)] text-[#ff66ff] border border-[rgba(255,0,255,0.5)]'
                    : 'bg-[rgba(0,255,255,0.3)] text-[#66ffff] border border-[rgba(0,255,255,0.5)]'
                }`}>
                  {characterData.characterGender === 'Fem' ? '♀ Female' : '♂ Male'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Character Form */}
      {isNewCharacter && (
        <div className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#00ffff]">✏️</span>
              Character Name
            </label>
            <input
              type="text"
              value={characterData.characterName}
              onChange={(e) => setCharacterData({ ...characterData, characterName: e.target.value })}
              placeholder="Enter your character's name..."
              className="neon-input"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#ff00ff]">⚧</span>
              Gender
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setCharacterData({ ...characterData, characterGender: 'Fem' })}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  characterData.characterGender === 'Fem'
                    ? 'bg-[rgba(255,0,255,0.3)] border-2 border-[#ff00ff] text-white shadow-lg shadow-[rgba(255,0,255,0.2)]'
                    : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] text-gray-400 hover:border-[#ff00ff]'
                }`}
              >
                <span>♀</span> Female
              </button>
              <button
                onClick={() => setCharacterData({ ...characterData, characterGender: 'Masc' })}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  characterData.characterGender === 'Masc'
                    ? 'bg-[rgba(0,255,255,0.3)] border-2 border-[#00ffff] text-white shadow-lg shadow-[rgba(0,255,255,0.2)]'
                    : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] text-gray-400 hover:border-[#00ffff]'
                }`}
              >
                <span>♂</span> Male
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#8b5cf6]">📝</span>
              Character Description
            </label>
            <textarea
              value={characterData.newCharacterDescription}
              onChange={(e) => setCharacterData({ ...characterData, newCharacterDescription: e.target.value })}
              placeholder="Describe your character in detail: appearance, outfit, personality, setting, art style..."
              className="neon-input resize-none"
              rows="5"
            />
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
              <span>💡</span>
              Be descriptive! Include details about their outfit, hair color, style, pose, and any specific traits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

export default function CharacterSelector({ onCharacterSelect }) {
  const [isNewCharacter, setIsNewCharacter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Character data
  const [characterData, setCharacterData] = useState({
    isNewCharacter: false,
    characterName: '',
    characterShow: '',
    characterGender: 'Fem',
    newCharacterDescription: '',
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search characters with debounce
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

  // Update character data
  useEffect(() => {
    const data = {
      ...characterData,
      isNewCharacter,
    };
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
    <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 border border-gray-700">
      {/* Mode Toggle */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleModeSwitch(false)}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            !isNewCharacter
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📺 Existing Character
        </button>
        <button
          onClick={() => handleModeSwitch(true)}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            isNewCharacter
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          ✨ New Character
        </button>
      </div>

      {/* Existing Character Search */}
      {!isNewCharacter && (
        <div className="space-y-4" ref={searchRef}>
          <label className="block text-white font-semibold mb-2">
            Search for a character
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Type character name or show..."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full max-w-4xl bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-y-auto">
              {searchResults.map((char, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCharacter(char)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors border-b border-gray-600 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{char.Character}</div>
                      <div className="text-sm text-gray-400">{char.Show}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      char.Gender === 'Fem' ? 'bg-pink-600' : 'bg-blue-600'
                    } text-white`}>
                      {char.Gender}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Character Display */}
          {characterData.characterName && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-white">{characterData.characterName}</div>
                  <div className="text-gray-400">from {characterData.characterShow}</div>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  characterData.characterGender === 'Fem' ? 'bg-pink-600' : 'bg-blue-600'
                } text-white`}>
                  {characterData.characterGender}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Character Form */}
      {isNewCharacter && (
        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={characterData.characterName}
              onChange={(e) =>
                setCharacterData({ ...characterData, characterName: e.target.value })
              }
              placeholder="Enter character name..."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Gender
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  setCharacterData({ ...characterData, characterGender: 'Fem' })
                }
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  characterData.characterGender === 'Fem'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Female
              </button>
              <button
                onClick={() =>
                  setCharacterData({ ...characterData, characterGender: 'Masc' })
                }
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  characterData.characterGender === 'Masc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Male
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Character Description
            </label>
            <textarea
              value={characterData.newCharacterDescription}
              onChange={(e) =>
                setCharacterData({
                  ...characterData,
                  newCharacterDescription: e.target.value,
                })
              }
              placeholder="Describe your character: appearance, outfit, personality, setting, etc."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="5"
            />
            <p className="text-xs text-gray-400 mt-2">
              Be descriptive! Include details about their outfit, hair, style, and any specific traits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

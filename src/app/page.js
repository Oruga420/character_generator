'use client';

import { useState, useEffect, useRef } from 'react';

// ========================================
// DATA CONSTANTS
// ========================================
const BUST_SIZES = [
  'PLANA', 'A', 'AA', 'B', 'BB', 'C', 'D', 'DD', 'DDD',
  '20D', '22DD', '24D', '26DD', '28D', '30DD', '32D', '34D', '36DD',
  '38DD', '40DD', '42DD', '44DD', '46DD', '48DD', '50DD', '52DD', '54DD', '56DD', '58DD', '60GG'
];

const HIP_THIGH_SIZES = [
  'PLANA', 'DELGADA', 'SLIM', 'ATHLETIC', 'AVERAGE', 'CURVAS',
  'WIDE', 'VERY WIDE', 'BBL', 'BBL EXAGERADO'
];

const ARM_SIZES = [
  'DELGADO', 'LEAN', 'TONED', 'DEFINIDO', 'ATHLETIC',
  'MUSCULOSO', 'VERY MUSCULAR', 'CULTURISTA'
];

const TABS = [
  { id: 'attributes', label: 'Physical Attributes', icon: '🏋️' },
  { id: 'characters', label: 'Characters', icon: '👤' },
  { id: 'style', label: 'Style & Action', icon: '✨' },
  { id: 'chat', label: 'AI Chat Assistant', icon: '💬' },
];

// ========================================
// MAIN APP COMPONENT
// ========================================
export default function Home() {
  const [activeTab, setActiveTab] = useState('attributes');
  const [tabIndex, setTabIndex] = useState(0);

  // Character state
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Attributes state
  const [attributes, setAttributes] = useState({
    bustSize: 15,
    hipThighSize: 5,
    armSize: 4,
    gender: 'female',
  });

  // Prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [modelType, setModelType] = useState('pro');

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Groq AI: Here are some popular female characters: Erza Scarlet, Mikasa Ackerman, Zero Two. Copy a name to use.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search characters
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
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

  // Navigation
  const navigateTab = (direction) => {
    const newIndex = direction === 'next'
      ? (tabIndex + 1) % TABS.length
      : (tabIndex - 1 + TABS.length) % TABS.length;
    setTabIndex(newIndex);
    setActiveTab(TABS[newIndex].id);
  };

  // Select character from search
  const handleSelectCharacter = (char) => {
    setSelectedCharacter(char);
    setSearchQuery(char.Character);
    setShowResults(false);
    // Set gender based on character
    setAttributes(prev => ({
      ...prev,
      gender: char.Gender === 'Fem' ? 'female' : 'male'
    }));
  };

  // Generate prompt with Groq
  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const characterData = {
        isNewCharacter: !selectedCharacter,
        characterName: selectedCharacter?.Character || 'Custom Character',
        characterShow: selectedCharacter?.Show || '',
        characterGender: attributes.gender === 'female' ? 'Fem' : 'Masc',
      };

      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterData,
          attributes: {
            breastSize: BUST_SIZES[attributes.bustSize],
            hipSize: HIP_THIGH_SIZES[attributes.hipThighSize],
            thighThickness: HIP_THIGH_SIZES[attributes.hipThighSize],
            armSize: ARM_SIZES[attributes.armSize],
          },
        }),
      });

      const data = await response.json();
      setGeneratedPrompt(data.prompt || 'Error generating prompt');
    } catch (error) {
      console.error('Error:', error);
      setGeneratedPrompt('Error generating prompt. Please try again.');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Generate image
  const handleGenerateImage = async (type) => {
    if (!generatedPrompt) {
      alert('Generate a prompt first!');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: generatedPrompt,
          modelType: type,
          aspectRatio: '4:3',
        }),
      });
      const data = await response.json();
      if (data.images && data.images[0]) {
        window.open(data.images[0], '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Chat with Groq
  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: chatMessages,
        }),
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || 'Error getting response'
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Copy chat response
  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Copy prompt
  const handleCopyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
    }
  };

  return (
    <div className="cyber-container">
      {/* Title */}
      <h1 className="cyber-title">Neon Anime Generator</h1>

      {/* Navigation */}
      <nav className="cyber-nav">
        <button className="cyber-nav-arrow" onClick={() => navigateTab('prev')}>‹</button>
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            className={`cyber-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setTabIndex(index); }}
          >
            <span className="cyber-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        <button className="cyber-nav-arrow" onClick={() => navigateTab('next')}>›</button>
      </nav>

      {/* Physical Attributes Panel */}
      {activeTab === 'attributes' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Physical Attributes / Atributos Físicos</h2>

          {/* Bust Size Slider */}
          <div className="cyber-slider-group">
            <div className="cyber-slider-label">
              <span className="cyber-slider-name">
                BUST SIZE / <span>PECHOS</span>
              </span>
              <span className="cyber-slider-value">{BUST_SIZES[attributes.bustSize]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={BUST_SIZES.length - 1}
              value={attributes.bustSize}
              onChange={(e) => setAttributes(prev => ({ ...prev, bustSize: parseInt(e.target.value) }))}
              style={{ '--progress': `${(attributes.bustSize / (BUST_SIZES.length - 1)) * 100}%` }}
            />
            <div className="cyber-slider-labels">
              <span>PLANA → A → AA → B → BB</span>
              <span>20D → ... → 60GG</span>
            </div>
          </div>

          {/* Hips & Thighs Slider */}
          <div className="cyber-slider-group">
            <div className="cyber-slider-label">
              <span className="cyber-slider-name">
                HIPS & THIGHS / <span>CADERAS Y PIERNAS</span>
              </span>
              <span className="cyber-slider-value">{HIP_THIGH_SIZES[attributes.hipThighSize]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={HIP_THIGH_SIZES.length - 1}
              value={attributes.hipThighSize}
              onChange={(e) => setAttributes(prev => ({ ...prev, hipThighSize: parseInt(e.target.value) }))}
              style={{ '--progress': `${(attributes.hipThighSize / (HIP_THIGH_SIZES.length - 1)) * 100}%` }}
            />
            <div className="cyber-slider-labels">
              <span>PLANA → DELGADA → CURVAS</span>
              <span>BBL → BBL EXAGERADO</span>
            </div>
          </div>

          {/* Male Arms Slider */}
          <div className="cyber-slider-group">
            <div className="cyber-slider-label">
              <span className="cyber-slider-name">
                MALE ARMS / <span>BRAZOS HOMBRES</span>
              </span>
              <span className="cyber-slider-value">{ARM_SIZES[attributes.armSize]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={ARM_SIZES.length - 1}
              value={attributes.armSize}
              onChange={(e) => setAttributes(prev => ({ ...prev, armSize: parseInt(e.target.value) }))}
              style={{ '--progress': `${(attributes.armSize / (ARM_SIZES.length - 1)) * 100}%` }}
            />
            <div className="cyber-slider-labels">
              <span>DELGADO → DEFINIDO</span>
              <span>MUSCULOSO → CULTURISTA</span>
            </div>
          </div>
        </div>
      )}

      {/* Characters Panel */}
      {activeTab === 'characters' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Character Selection / Selección de Personaje</h2>

          <div className="relative" ref={searchRef}>
            <input
              type="text"
              className="cyber-input"
              placeholder="Search character name or show..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="cyber-loading">
                  <span className="cyber-loading-dot"></span>
                  <span className="cyber-loading-dot"></span>
                  <span className="cyber-loading-dot"></span>
                </div>
              </div>
            )}

            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="cyber-search-results">
                {searchResults.map((char, index) => (
                  <div
                    key={index}
                    className="cyber-search-item"
                    onClick={() => handleSelectCharacter(char)}
                  >
                    <div>
                      <div className="cyber-search-name">{char.Character}</div>
                      <div className="cyber-search-show">{char.Show}</div>
                    </div>
                    <span className={`cyber-search-badge ${char.Gender === 'Fem' ? 'fem' : 'masc'}`}>
                      {char.Gender}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Character Display */}
          {selectedCharacter && (
            <div className="cyber-selected-character">
              <div className="cyber-selected-name">{selectedCharacter.Character}</div>
              <div className="cyber-selected-show">from {selectedCharacter.Show}</div>
            </div>
          )}
        </div>
      )}

      {/* Style & Action Panel */}
      {activeTab === 'style' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Style & Action / Estilo y Acción</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Coming soon: Pose selection, art style, background settings...
          </p>
        </div>
      )}

      {/* Prompt Generator & Chat Section */}
      <div className="cyber-grid-3">
        {/* Prompt Generator */}
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Prompt Generator & API</h2>

          {/* Prompt Display */}
          <div className={`cyber-prompt-box ${!generatedPrompt ? 'empty' : ''}`} style={{ marginBottom: '20px' }}>
            {generatedPrompt || 'GROQ AI PROMPT WILL APPEAR HERE...'}
          </div>

          {/* Buttons Row 1 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
              className="cyber-button cyber-button-primary"
              style={{ flex: 1 }}
              onClick={() => handleGenerateImage('pro')}
              disabled={isGeneratingImage || !generatedPrompt}
            >
              {isGeneratingImage ? 'GENERATING...' : 'GENERATE with NANO BANANA PRO (Replicate)'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
              className="cyber-button"
              style={{ flex: 1 }}
              onClick={() => handleGenerateImage('regular')}
              disabled={isGeneratingImage || !generatedPrompt}
            >
              GENERATE with NANO BANANA REGULAR (Replicate)
            </button>
          </div>

          {/* Model Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>NANO BANANA MODEL: PRO/REGULAR</span>
            <div
              className="cyber-toggle"
              onClick={() => setModelType(modelType === 'pro' ? 'regular' : 'pro')}
            >
              <div className={`cyber-toggle-track ${modelType === 'pro' ? 'active' : ''}`}>
                <div className="cyber-toggle-thumb"></div>
              </div>
            </div>
          </div>

          {/* Buttons Row 2 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="cyber-button cyber-button-green"
              style={{ flex: 1 }}
              onClick={handleGeneratePrompt}
              disabled={isGeneratingPrompt}
            >
              {isGeneratingPrompt ? 'GENERATING...' : 'SEND SPECS TO GROQ ⚡'}
            </button>
            <button
              className="cyber-button cyber-button-purple"
              style={{ flex: 1 }}
              onClick={handleCopyPrompt}
              disabled={!generatedPrompt}
            >
              COPY GENERATED PROMPT
            </button>
          </div>
        </div>

        {/* AI Chat Assistant */}
        {activeTab === 'chat' || true ? (
          <div className="cyber-panel">
            <h2 className="cyber-panel-title">AI Chat Assistant</h2>

            {/* Chat Messages */}
            <div className="cyber-chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`cyber-chat-message ${msg.role}`}>
                  <div className="cyber-chat-label">
                    {msg.role === 'assistant' ? 'Groq AI' : 'You'}
                  </div>
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <button
                      className="cyber-button"
                      style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.7rem' }}
                      onClick={() => handleCopyResponse(msg.content)}
                    >
                      COPY RESPONSE
                    </button>
                  )}
                </div>
              ))}
              {isChatLoading && (
                <div className="cyber-loading" style={{ padding: '10px' }}>
                  <span className="cyber-loading-dot"></span>
                  <span className="cyber-loading-dot"></span>
                  <span className="cyber-loading-dot"></span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="cyber-chat-input-row">
              <input
                type="text"
                className="cyber-input"
                placeholder="Ask Groq AI for character names..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button
                className="cyber-button cyber-button-primary"
                onClick={handleSendChat}
                disabled={isChatLoading || !chatInput.trim()}
              >
                SEND
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

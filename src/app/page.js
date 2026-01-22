'use client';

import { useState, useEffect, useRef } from 'react';

// ========================================
// DATA CONSTANTS - ALL TABS
// ========================================

// TAB 1: BODY TYPE
const CUP_SIZES = [
  'FLAT', 'A', 'AA', 'B', 'BB', 'C', 'CC', 'D', 'DD', 'DDD',
  '20D', '22DD', '24D', '26DD', '28D', '30DD', '32D', '34D', '36DD',
  '38DD', '40DD', '42DD', '44DD', '46DD', '48DD', '50DD', '52DD', '54DD', '56DD', '58DD', '60GG'
];

const HIP_SIZES = [
  'FLAT', 'NARROW', 'SLIM', 'ATHLETIC', 'AVERAGE', 'CURVY',
  'WIDE', 'VERY WIDE', 'BBL LIGHT', 'BBL', 'BBL EXAGGERATED'
];

const THIGH_SIZES = [
  'THIN', 'SLIM', 'TONED', 'ATHLETIC', 'AVERAGE', 'THICK',
  'VERY THICK', 'MASSIVE', 'THUNDER THIGHS'
];

const GLUTE_SIZES = [
  'FLAT', 'SMALL', 'AVERAGE', 'ROUND', 'BUBBLE', 'BIG',
  'VERY BIG', 'HUGE', 'EXTREME BBL'
];

const MALE_ARM_SIZES = [
  'SKINNY', 'LEAN', 'TONED', 'DEFINED', 'ATHLETIC',
  'MUSCULAR', 'VERY MUSCULAR', 'BODYBUILDER', 'MASSIVE'
];

const MALE_CHEST_SIZES = [
  'SLIM', 'LEAN', 'TONED', 'ATHLETIC', 'MUSCULAR',
  'VERY MUSCULAR', 'BODYBUILDER', 'MASSIVE'
];

// TAB 2: BODY FEATURES
const BODY_TYPES = [
  'SKINNY', 'SLIM', 'PETITE', 'ATHLETIC', 'AVERAGE', 'CURVY',
  'CHUBBY', 'THICK', 'BBW', 'MAMA', 'MILF BODY'
];

const ATTITUDES = [
  'SHY', 'TIMID', 'SWEET', 'INNOCENT', 'PLAYFUL', 'FLIRTY',
  'CONFIDENT', 'SEDUCTIVE', 'DOMINANT', 'AGGRESSIVE', 'FIERCE'
];

const BODY_LANGUAGE = [
  'RELAXED', 'CASUAL', 'ELEGANT', 'PLAYFUL', 'PROVOCATIVE',
  'CONFIDENT', 'SUBMISSIVE', 'DOMINANT', 'DRAMATIC', 'ACTION'
];

// TAB 3: HAIR STYLE
const FEMALE_HAIR_STYLES = [
  'LONG STRAIGHT', 'LONG WAVY', 'LONG CURLY', 'BOB CUT', 'PIXIE CUT',
  'PONYTAIL', 'TWIN TAILS', 'BUN', 'BRAIDS', 'SIDE SWEPT',
  'BANGS', 'HIME CUT', 'MESSY', 'ELEGANT UPDO', 'DRILL CURLS'
];

const MALE_HAIR_STYLES = [
  'SHORT SPIKY', 'SLICKED BACK', 'MESSY', 'UNDERCUT', 'BUZZ CUT',
  'LONG FLOWING', 'PONYTAIL', 'MOHAWK', 'CREW CUT', 'SHAGGY',
  'POMPADOUR', 'FADE', 'CURTAIN BANGS', 'MULLET', 'BALD'
];

const HAIR_COLORS = [
  'BLACK', 'BROWN', 'BLONDE', 'RED', 'ORANGE', 'PINK',
  'BLUE', 'PURPLE', 'GREEN', 'WHITE', 'SILVER', 'GRADIENT',
  'RAINBOW', 'TWO-TONE', 'HIGHLIGHTS'
];

// TAB 4: TATTOOS
const TATTOO_STYLES = [
  'TRADITIONAL', 'NEO-TRADITIONAL', 'JAPANESE IREZUMI', 'TRIBAL',
  'BLACKWORK', 'DOTWORK', 'GEOMETRIC', 'WATERCOLOR', 'REALISM',
  'MINIMALIST', 'FINE LINE', 'CHICANO', 'BIOMECHANICAL', 'TRASH POLKA'
];

const TATTOO_PLACEMENTS = [
  'FULL SLEEVE', 'HALF SLEEVE', 'QUARTER SLEEVE', 'FOREARM',
  'UPPER ARM', 'SHOULDER', 'BACK FULL', 'UPPER BACK', 'LOWER BACK',
  'CHEST', 'STOMACH', 'RIB CAGE', 'THIGH', 'CALF', 'ANKLE',
  'NECK', 'FACE', 'HAND', 'FINGER', 'FOOT'
];

const TATTOO_SUBJECTS = [
  'DRAGON', 'PHOENIX', 'SNAKE', 'TIGER', 'KOI FISH', 'SKULL',
  'ROSES', 'CHERRY BLOSSOMS', 'LOTUS', 'MANDALA', 'TRIBAL PATTERNS',
  'GEOMETRIC SHAPES', 'PORTRAITS', 'ANIME CHARACTERS', 'KANJI',
  'DEMONS', 'ANGELS', 'BUTTERFLIES', 'SCORPION', 'WOLF'
];

const TATTOO_COVERAGE = [
  'NONE', 'MINIMAL (1-2)', 'LIGHT', 'MODERATE', 'HEAVY', 'FULL BODY', 'YAKUZA STYLE'
];

// TAB 5: OUTFIT - Categories
const OUTFIT_CATEGORIES = [
  'CASUAL', 'FORMAL', 'SWIMWEAR', 'LINGERIE', 'SPORTSWEAR',
  'FANTASY', 'SCI-FI', 'TRADITIONAL', 'UNIFORM', 'COSPLAY',
  'STREETWEAR', 'GOTHIC', 'ELEGANT', 'SEXY', 'CUTE'
];

// TAB 6: POSE REFERENCE
const POSE_CATEGORIES = [
  'STANDING', 'SITTING', 'LYING DOWN', 'KNEELING', 'CROUCHING',
  'ACTION', 'DYNAMIC', 'ROMANTIC', 'DRAMATIC', 'CASUAL',
  'PROVOCATIVE', 'ELEGANT', 'PLAYFUL', 'BATTLE READY', 'RELAXED'
];

// TAB 7: FACIAL EXPRESSIONS
const EYE_EXPRESSIONS = [
  'NORMAL', 'WIDE OPEN', 'HALF CLOSED', 'CLOSED', 'WINKING',
  'LOOKING UP', 'LOOKING DOWN', 'LOOKING SIDE', 'HEART EYES', 'CRYING',
  'ANGRY', 'SEDUCTIVE', 'INNOCENT', 'SHY', 'DETERMINED'
];

const MOUTH_EXPRESSIONS = [
  'NEUTRAL', 'SMILE', 'BIG SMILE', 'SMIRK', 'OPEN MOUTH',
  'TONGUE OUT', 'POUT', 'KISS', 'TEETH SHOWING', 'FANG SMILE',
  'BITING LIP', 'DROOLING', 'AHEGAO', 'O FACE', 'SURPRISED'
];

const FACE_ATTITUDES = [
  'HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'SCARED', 'DISGUSTED',
  'CONFIDENT', 'SHY', 'SEDUCTIVE', 'INNOCENT', 'PLAYFUL',
  'SERIOUS', 'TIRED', 'DRUNK', 'EXCITED', 'BLUSHING'
];

// ALL TABS CONFIG
const TABS = [
  { id: 'body-type', label: 'Body Type', icon: '💪' },
  { id: 'body-features', label: 'Body Features', icon: '✨' },
  { id: 'hair-style', label: 'Hair Style', icon: '💇' },
  { id: 'tattoos', label: 'Tattoos', icon: '🎨' },
  { id: 'outfit', label: 'Outfit', icon: '👗' },
  { id: 'pose', label: 'Pose Reference', icon: '🎭' },
  { id: 'facial', label: 'Facial Expression', icon: '😊' },
  { id: 'character', label: 'Character', icon: '👤' },
];

// ========================================
// MAIN APP COMPONENT
// ========================================
export default function Home() {
  // Navigation state
  const [activeTab, setActiveTab] = useState('body-type');
  const [tabIndex, setTabIndex] = useState(0);

  // Gender toggle
  const [gender, setGender] = useState('female');

  // TAB 1: Body Type state
  const [bodyType, setBodyType] = useState({
    cupSize: 15,
    hipSize: 5,
    thighSize: 5,
    gluteSize: 4,
    maleArmSize: 4,
    maleChestSize: 4,
  });

  // TAB 2: Body Features state
  const [bodyFeatures, setBodyFeatures] = useState({
    bodyType: 4,
    attitude: 5,
    bodyLanguage: 4,
  });

  // TAB 3: Hair Style state
  const [hairStyle, setHairStyle] = useState({
    style: 0,
    color: 0,
  });

  // TAB 4: Tattoos state
  const [tattoos, setTattoos] = useState({
    style: 0,
    placement: [],
    subjects: [],
    coverage: 0,
    customDescription: '',
  });

  // TAB 5: Outfit state
  const [outfit, setOutfit] = useState({
    category: 0,
    description: '',
    uploadedImage: null,
  });

  // TAB 6: Pose state
  const [pose, setPose] = useState({
    category: 0,
    uploadedImage: null,
    customDescription: '',
  });

  // TAB 7: Facial Expression state
  const [facial, setFacial] = useState({
    eyes: 0,
    mouth: 0,
    attitude: 0,
  });

  // TAB 8: Character state
  const [character, setCharacter] = useState({
    isNew: true,
    searchQuery: '',
    selectedCharacter: null,
    newCharacterName: '',
    newCharacterShow: '',
  });

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de Groq AI. Pregúntame nombres de personajes de anime, videojuegos, películas, etc. Te ayudaré a encontrar el personaje perfecto.' }
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

  // Search characters in Neon DB
  useEffect(() => {
    if (character.searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/characters/search?q=${encodeURIComponent(character.searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.characters || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [character.searchQuery]);

  // Navigation functions
  const navigateTab = (direction) => {
    const newIndex = direction === 'next'
      ? (tabIndex + 1) % TABS.length
      : (tabIndex - 1 + TABS.length) % TABS.length;
    setTabIndex(newIndex);
    setActiveTab(TABS[newIndex].id);
  };

  const selectTab = (tabId, index) => {
    setActiveTab(tabId);
    setTabIndex(index);
  };

  // Character selection
  const handleSelectCharacter = (char) => {
    setCharacter(prev => ({
      ...prev,
      selectedCharacter: char,
      searchQuery: char.Character,
      isNew: false,
    }));
    setShowResults(false);
    // Set gender based on character
    if (char.Gender) {
      setGender(char.Gender === 'Fem' ? 'female' : 'male');
    }
  };

  // Toggle tattoo placement/subject
  const toggleTattooItem = (type, item) => {
    setTattoos(prev => {
      const current = prev[type];
      if (current.includes(item)) {
        return { ...prev, [type]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [type]: [...current, item] };
      }
    });
  };

  // Build the complete prompt from all selections
  const buildPromptData = () => {
    const data = {
      gender,
      // Body Type
      cupSize: gender === 'female' ? CUP_SIZES[bodyType.cupSize] : null,
      hipSize: HIP_SIZES[bodyType.hipSize],
      thighSize: THIGH_SIZES[bodyType.thighSize],
      gluteSize: GLUTE_SIZES[bodyType.gluteSize],
      maleArmSize: gender === 'male' ? MALE_ARM_SIZES[bodyType.maleArmSize] : null,
      maleChestSize: gender === 'male' ? MALE_CHEST_SIZES[bodyType.maleChestSize] : null,
      // Body Features
      bodyType: BODY_TYPES[bodyFeatures.bodyType],
      attitude: ATTITUDES[bodyFeatures.attitude],
      bodyLanguage: BODY_LANGUAGE[bodyFeatures.bodyLanguage],
      // Hair
      hairStyle: gender === 'female' ? FEMALE_HAIR_STYLES[hairStyle.style] : MALE_HAIR_STYLES[hairStyle.style],
      hairColor: HAIR_COLORS[hairStyle.color],
      // Tattoos
      tattooStyle: tattoos.coverage > 0 ? TATTOO_STYLES[tattoos.style] : null,
      tattooPlacements: tattoos.placement,
      tattooSubjects: tattoos.subjects,
      tattooCoverage: TATTOO_COVERAGE[tattoos.coverage],
      tattooDescription: tattoos.customDescription,
      // Outfit
      outfitCategory: OUTFIT_CATEGORIES[outfit.category],
      outfitDescription: outfit.description,
      // Pose
      poseCategory: POSE_CATEGORIES[pose.category],
      poseDescription: pose.customDescription,
      // Facial
      eyeExpression: EYE_EXPRESSIONS[facial.eyes],
      mouthExpression: MOUTH_EXPRESSIONS[facial.mouth],
      faceAttitude: FACE_ATTITUDES[facial.attitude],
      // Character
      isNewCharacter: character.isNew,
      characterName: character.isNew ? character.newCharacterName : character.selectedCharacter?.Character,
      characterShow: character.isNew ? character.newCharacterShow : character.selectedCharacter?.Show,
    };
    return data;
  };

  // Generate prompt with Groq
  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const promptData = buildPromptData();

      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptData }),
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

  // Generate image with Replicate (Nano Banana)
  const handleGenerateImage = async (modelType) => {
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
          modelType: modelType,
          aspectRatio: '4:3',
        }),
      });
      const data = await response.json();
      if (data.images && data.images[0]) {
        window.open(data.images[0], '_blank');
      } else if (data.error) {
        alert('Error: ' + data.error);
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

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Render slider component
  const renderSlider = (label, labelEs, value, max, onChange, options) => (
    <div className="cyber-slider-group">
      <div className="cyber-slider-label">
        <span className="cyber-slider-name">
          {label} / <span>{labelEs}</span>
        </span>
        <span className="cyber-slider-value">{options[value]}</span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ '--progress': `${(value / max) * 100}%` }}
      />
      <div className="cyber-slider-labels">
        <span>{options[0]}</span>
        <span>{options[options.length - 1]}</span>
      </div>
    </div>
  );

  // Render multi-select chips
  const renderChips = (options, selected, onToggle) => (
    <div className="cyber-chips">
      {options.map((option, idx) => (
        <button
          key={idx}
          className={`cyber-chip ${selected.includes(option) ? 'active' : ''}`}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );

  return (
    <div className="cyber-container">
      {/* Title */}
      <h1 className="cyber-title">Character Builder App</h1>
      <p className="cyber-subtitle">Neon Anime Generator • Powered by Groq AI & Nano Banana</p>

      {/* Gender Toggle */}
      <div className="cyber-gender-toggle">
        <button
          className={`cyber-gender-btn ${gender === 'female' ? 'active' : ''}`}
          onClick={() => setGender('female')}
        >
          ♀ Female
        </button>
        <button
          className={`cyber-gender-btn ${gender === 'male' ? 'active' : ''}`}
          onClick={() => setGender('male')}
        >
          ♂ Male
        </button>
      </div>

      {/* Navigation Carousel */}
      <nav className="cyber-nav">
        <button className="cyber-nav-arrow" onClick={() => navigateTab('prev')}>
          ‹
        </button>
        <div className="cyber-tabs-container">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              className={`cyber-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => selectTab(tab.id, index)}
            >
              <span className="cyber-tab-icon">{tab.icon}</span>
              <span className="cyber-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <button className="cyber-nav-arrow" onClick={() => navigateTab('next')}>
          ›
        </button>
      </nav>

      {/* Tab indicator */}
      <div className="cyber-tab-indicator">
        Tab {tabIndex + 1} of {TABS.length}: {TABS[tabIndex].label}
      </div>

      {/* TAB 1: Body Type */}
      {activeTab === 'body-type' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Body Type / Tipo de Cuerpo</h2>

          {gender === 'female' ? (
            <>
              {renderSlider('CUP SIZE', 'TALLA DE COPA', bodyType.cupSize, CUP_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, cupSize: v })), CUP_SIZES)}
              {renderSlider('HIP WIDTH', 'ANCHO DE CADERAS', bodyType.hipSize, HIP_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, hipSize: v })), HIP_SIZES)}
              {renderSlider('THIGH THICKNESS', 'GROSOR DE PIERNAS', bodyType.thighSize, THIGH_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, thighSize: v })), THIGH_SIZES)}
              {renderSlider('GLUTE SIZE', 'TAMAÑO DE GLÚTEOS', bodyType.gluteSize, GLUTE_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, gluteSize: v })), GLUTE_SIZES)}
            </>
          ) : (
            <>
              {renderSlider('ARM SIZE', 'TAMAÑO DE BRAZOS', bodyType.maleArmSize, MALE_ARM_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, maleArmSize: v })), MALE_ARM_SIZES)}
              {renderSlider('CHEST SIZE', 'TAMAÑO DE PECHO', bodyType.maleChestSize, MALE_CHEST_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, maleChestSize: v })), MALE_CHEST_SIZES)}
              {renderSlider('HIP WIDTH', 'ANCHO DE CADERAS', bodyType.hipSize, HIP_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, hipSize: v })), HIP_SIZES)}
              {renderSlider('THIGH SIZE', 'GROSOR DE PIERNAS', bodyType.thighSize, THIGH_SIZES.length - 1,
                (v) => setBodyType(p => ({ ...p, thighSize: v })), THIGH_SIZES)}
            </>
          )}
        </div>
      )}

      {/* TAB 2: Body Features */}
      {activeTab === 'body-features' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Body Features / Características Corporales</h2>

          {renderSlider('BODY TYPE', 'TIPO DE CUERPO', bodyFeatures.bodyType, BODY_TYPES.length - 1,
            (v) => setBodyFeatures(p => ({ ...p, bodyType: v })), BODY_TYPES)}
          {renderSlider('ATTITUDE', 'ACTITUD', bodyFeatures.attitude, ATTITUDES.length - 1,
            (v) => setBodyFeatures(p => ({ ...p, attitude: v })), ATTITUDES)}
          {renderSlider('BODY LANGUAGE', 'LENGUAJE CORPORAL', bodyFeatures.bodyLanguage, BODY_LANGUAGE.length - 1,
            (v) => setBodyFeatures(p => ({ ...p, bodyLanguage: v })), BODY_LANGUAGE)}
        </div>
      )}

      {/* TAB 3: Hair Style */}
      {activeTab === 'hair-style' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Hair Style / Estilo de Cabello</h2>

          {renderSlider(
            gender === 'female' ? 'FEMALE HAIR STYLE' : 'MALE HAIR STYLE',
            'ESTILO DE CABELLO',
            hairStyle.style,
            (gender === 'female' ? FEMALE_HAIR_STYLES : MALE_HAIR_STYLES).length - 1,
            (v) => setHairStyle(p => ({ ...p, style: v })),
            gender === 'female' ? FEMALE_HAIR_STYLES : MALE_HAIR_STYLES
          )}
          {renderSlider('HAIR COLOR', 'COLOR DE CABELLO', hairStyle.color, HAIR_COLORS.length - 1,
            (v) => setHairStyle(p => ({ ...p, color: v })), HAIR_COLORS)}
        </div>
      )}

      {/* TAB 4: Tattoos */}
      {activeTab === 'tattoos' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Tattoos / Tatuajes</h2>

          {renderSlider('COVERAGE', 'COBERTURA', tattoos.coverage, TATTOO_COVERAGE.length - 1,
            (v) => setTattoos(p => ({ ...p, coverage: v })), TATTOO_COVERAGE)}

          {tattoos.coverage > 0 && (
            <>
              {renderSlider('STYLE', 'ESTILO', tattoos.style, TATTOO_STYLES.length - 1,
                (v) => setTattoos(p => ({ ...p, style: v })), TATTOO_STYLES)}

              <div className="cyber-section">
                <h3 className="cyber-section-title">Placements / Ubicaciones</h3>
                {renderChips(TATTOO_PLACEMENTS, tattoos.placement, (item) => toggleTattooItem('placement', item))}
              </div>

              <div className="cyber-section">
                <h3 className="cyber-section-title">Subjects / Temas</h3>
                {renderChips(TATTOO_SUBJECTS, tattoos.subjects, (item) => toggleTattooItem('subjects', item))}
              </div>

              <div className="cyber-section">
                <h3 className="cyber-section-title">Custom Description / Descripción Personalizada</h3>
                <textarea
                  className="cyber-textarea"
                  placeholder="Describe specific tattoo details..."
                  value={tattoos.customDescription}
                  onChange={(e) => setTattoos(p => ({ ...p, customDescription: e.target.value }))}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 5: Outfit */}
      {activeTab === 'outfit' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Outfit / Atuendo</h2>

          {renderSlider('CATEGORY', 'CATEGORÍA', outfit.category, OUTFIT_CATEGORIES.length - 1,
            (v) => setOutfit(p => ({ ...p, category: v })), OUTFIT_CATEGORIES)}

          <div className="cyber-section">
            <h3 className="cyber-section-title">Outfit Description / Descripción del Atuendo</h3>
            <textarea
              className="cyber-textarea"
              placeholder="Describe the outfit in detail (e.g., red dress with gold accents, leather jacket...)"
              value={outfit.description}
              onChange={(e) => setOutfit(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="cyber-section">
            <h3 className="cyber-section-title">Upload Reference / Subir Referencia</h3>
            <div className="cyber-upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setOutfit(p => ({ ...p, uploadedImage: ev.target.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <p>Click or drag image to upload outfit reference</p>
            </div>
            {outfit.uploadedImage && (
              <div className="cyber-preview">
                <img src={outfit.uploadedImage} alt="Outfit reference" />
                <button onClick={() => setOutfit(p => ({ ...p, uploadedImage: null }))}>Remove</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: Pose Reference */}
      {activeTab === 'pose' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Pose Reference / Referencia de Pose</h2>

          {renderSlider('POSE CATEGORY', 'CATEGORÍA DE POSE', pose.category, POSE_CATEGORIES.length - 1,
            (v) => setPose(p => ({ ...p, category: v })), POSE_CATEGORIES)}

          <div className="cyber-section">
            <h3 className="cyber-section-title">Pose Description / Descripción de la Pose</h3>
            <textarea
              className="cyber-textarea"
              placeholder="Describe the pose in detail..."
              value={pose.customDescription}
              onChange={(e) => setPose(p => ({ ...p, customDescription: e.target.value }))}
            />
          </div>

          <div className="cyber-section">
            <h3 className="cyber-section-title">Upload Reference / Subir Referencia</h3>
            <div className="cyber-upload-zone">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setPose(p => ({ ...p, uploadedImage: ev.target.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <p>Click or drag image to upload pose reference</p>
            </div>
            {pose.uploadedImage && (
              <div className="cyber-preview">
                <img src={pose.uploadedImage} alt="Pose reference" />
                <button onClick={() => setPose(p => ({ ...p, uploadedImage: null }))}>Remove</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: Facial Expression */}
      {activeTab === 'facial' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Facial Expression / Expresión Facial</h2>

          {renderSlider('EYE EXPRESSION', 'EXPRESIÓN DE OJOS', facial.eyes, EYE_EXPRESSIONS.length - 1,
            (v) => setFacial(p => ({ ...p, eyes: v })), EYE_EXPRESSIONS)}
          {renderSlider('MOUTH EXPRESSION', 'EXPRESIÓN DE BOCA', facial.mouth, MOUTH_EXPRESSIONS.length - 1,
            (v) => setFacial(p => ({ ...p, mouth: v })), MOUTH_EXPRESSIONS)}
          {renderSlider('FACE ATTITUDE', 'ACTITUD FACIAL', facial.attitude, FACE_ATTITUDES.length - 1,
            (v) => setFacial(p => ({ ...p, attitude: v })), FACE_ATTITUDES)}
        </div>
      )}

      {/* TAB 8: Character */}
      {activeTab === 'character' && (
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Character / Personaje</h2>

          <div className="cyber-character-toggle">
            <button
              className={`cyber-toggle-btn ${character.isNew ? 'active' : ''}`}
              onClick={() => setCharacter(p => ({ ...p, isNew: true, selectedCharacter: null }))}
            >
              🆕 New Character
            </button>
            <button
              className={`cyber-toggle-btn ${!character.isNew ? 'active' : ''}`}
              onClick={() => setCharacter(p => ({ ...p, isNew: false }))}
            >
              🔍 Existing Character
            </button>
          </div>

          {character.isNew ? (
            <div className="cyber-new-character">
              <div className="cyber-input-group">
                <label>Character Name / Nombre del Personaje</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="Enter new character name..."
                  value={character.newCharacterName}
                  onChange={(e) => setCharacter(p => ({ ...p, newCharacterName: e.target.value }))}
                />
              </div>
              <div className="cyber-input-group">
                <label>Show/Game/Movie / Serie/Juego/Película</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="Enter origin (anime, game, movie, etc.)..."
                  value={character.newCharacterShow}
                  onChange={(e) => setCharacter(p => ({ ...p, newCharacterShow: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <div className="cyber-search-container" ref={searchRef}>
              <input
                type="text"
                className="cyber-input"
                placeholder="Search character name or show in database..."
                value={character.searchQuery}
                onChange={(e) => setCharacter(p => ({ ...p, searchQuery: e.target.value }))}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
              />
              {isSearching && (
                <div className="cyber-search-loading">
                  <span className="cyber-loading-dot"></span>
                  <span className="cyber-loading-dot"></span>
                  <span className="cyber-loading-dot"></span>
                </div>
              )}

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
                      <span className={`cyber-badge ${char.Gender === 'Fem' ? 'fem' : 'masc'}`}>
                        {char.Gender}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {character.selectedCharacter && (
                <div className="cyber-selected-character">
                  <h3>{character.selectedCharacter.Character}</h3>
                  <p>from {character.selectedCharacter.Show}</p>
                  <span className={`cyber-badge ${character.selectedCharacter.Gender === 'Fem' ? 'fem' : 'masc'}`}>
                    {character.selectedCharacter.Gender}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Section: Prompt Generator + Chat */}
      <div className="cyber-bottom-grid">
        {/* Prompt Generator */}
        <div className="cyber-panel">
          <h2 className="cyber-panel-title">Prompt Generator / Generador de Prompts</h2>

          <div className={`cyber-prompt-box ${!generatedPrompt ? 'empty' : ''}`}>
            {generatedPrompt || 'Generated prompt will appear here after clicking "Send to Groq"...'}
          </div>

          <div className="cyber-button-row">
            <button
              className="cyber-button cyber-button-green"
              onClick={handleGeneratePrompt}
              disabled={isGeneratingPrompt}
            >
              {isGeneratingPrompt ? '⏳ GENERATING...' : '⚡ SEND TO GROQ AI'}
            </button>
            <button
              className="cyber-button cyber-button-purple"
              onClick={() => copyToClipboard(generatedPrompt)}
              disabled={!generatedPrompt}
            >
              📋 COPY PROMPT
            </button>
          </div>

          <div className="cyber-divider"></div>

          <h3 className="cyber-section-title">Generate Image / Generar Imagen</h3>
          <div className="cyber-button-row">
            <button
              className="cyber-button cyber-button-primary"
              onClick={() => handleGenerateImage('pro')}
              disabled={isGeneratingImage || !generatedPrompt}
            >
              {isGeneratingImage ? '⏳ GENERATING...' : '🍌 NANO BANANA PRO'}
            </button>
            <button
              className="cyber-button cyber-button-cyan"
              onClick={() => handleGenerateImage('regular')}
              disabled={isGeneratingImage || !generatedPrompt}
            >
              {isGeneratingImage ? '⏳ GENERATING...' : '🍌 NANO BANANA REGULAR'}
            </button>
          </div>
        </div>

        {/* AI Chat Assistant */}
        <div className="cyber-panel cyber-chat-panel">
          <h2 className="cyber-panel-title">AI Chat Assistant / Asistente de Chat</h2>

          <div className="cyber-chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`cyber-chat-message ${msg.role}`}>
                <div className="cyber-chat-header">
                  <span className="cyber-chat-role">{msg.role === 'assistant' ? '🤖 Groq AI' : '👤 You'}</span>
                  {msg.role === 'assistant' && (
                    <button
                      className="cyber-copy-btn"
                      onClick={() => copyToClipboard(msg.content)}
                      title="Copy response"
                    >
                      📋
                    </button>
                  )}
                </div>
                <div className="cyber-chat-content">{msg.content}</div>
              </div>
            ))}
            {isChatLoading && (
              <div className="cyber-chat-loading">
                <span className="cyber-loading-dot"></span>
                <span className="cyber-loading-dot"></span>
                <span className="cyber-loading-dot"></span>
              </div>
            )}
          </div>

          <div className="cyber-chat-input-row">
            <input
              type="text"
              className="cyber-input"
              placeholder="Ask for character names, anime suggestions..."
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
      </div>

      {/* Current Selection Summary */}
      <div className="cyber-panel cyber-summary">
        <h2 className="cyber-panel-title">Current Selection Summary / Resumen de Selección</h2>
        <div className="cyber-summary-grid">
          <div className="cyber-summary-item">
            <span className="label">Gender:</span>
            <span className="value">{gender}</span>
          </div>
          {gender === 'female' && (
            <div className="cyber-summary-item">
              <span className="label">Cup:</span>
              <span className="value">{CUP_SIZES[bodyType.cupSize]}</span>
            </div>
          )}
          <div className="cyber-summary-item">
            <span className="label">Hips:</span>
            <span className="value">{HIP_SIZES[bodyType.hipSize]}</span>
          </div>
          <div className="cyber-summary-item">
            <span className="label">Thighs:</span>
            <span className="value">{THIGH_SIZES[bodyType.thighSize]}</span>
          </div>
          <div className="cyber-summary-item">
            <span className="label">Hair:</span>
            <span className="value">{gender === 'female' ? FEMALE_HAIR_STYLES[hairStyle.style] : MALE_HAIR_STYLES[hairStyle.style]} ({HAIR_COLORS[hairStyle.color]})</span>
          </div>
          <div className="cyber-summary-item">
            <span className="label">Tattoos:</span>
            <span className="value">{TATTOO_COVERAGE[tattoos.coverage]}</span>
          </div>
          <div className="cyber-summary-item">
            <span className="label">Character:</span>
            <span className="value">
              {character.isNew
                ? (character.newCharacterName || 'New Character')
                : (character.selectedCharacter?.Character || 'Not selected')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

const BREAST_SIZES = [
  '20D', '22DD', '24D', '26DD', '28D', '30DD', '32A', '32AA', '32B', '32BB',
  '32C', '32D', '32DD', '34A', '34B', '34C', '34D', '34DD', '34DDD', '36A',
  '36B', '36C', '36D', '36DD', '36DDD', '38B', '38C', '38D', '38DD', '38DDD',
  '40C', '40D', '40DD', '40DDD', '42C', '42D', '42DD', '44C', '44D', '44DD',
  '46D', '46DD', '48D', '48DD', '50D', '50DD', '52DD', '54DD', '56DD', '58DD', '60GG'
];

const HIP_SIZES = [
  'Very Narrow', 'Narrow', 'Slim', 'Athletic', 'Average', 'Curvy',
  'Wide', 'Very Wide', 'Extremely Wide', 'Soft BBL', 'Moderate BBL',
  'Full BBL', 'Exaggerated BBL'
];

const THIGH_SIZES = [
  'Very Slim', 'Slim', 'Toned', 'Athletic', 'Average', 'Thick',
  'Very Thick', 'Muscular', 'Very Muscular'
];

const GLUTE_SIZES = [
  'Flat', 'Small', 'Modest', 'Average', 'Round', 'Full', 'Large',
  'Very Large', 'Soft BBL', 'Moderate BBL', 'Full BBL', 'Exaggerated BBL'
];

const ARM_SIZES = [
  'Very Lean', 'Lean', 'Toned', 'Athletic', 'Defined', 'Muscular',
  'Very Muscular', 'Bodybuilder', 'Extremely Muscular'
];

// Tattoo Categories and Options
const TATTOO_STYLES = [
  { id: 'traditional', name: 'Traditional/Old School', desc: 'Bold lines, limited colors, classic designs' },
  { id: 'neo_traditional', name: 'Neo-Traditional', desc: 'Modern take with more detail and colors' },
  { id: 'japanese', name: 'Japanese/Irezumi', desc: 'Dragons, koi, cherry blossoms, waves' },
  { id: 'tribal', name: 'Tribal', desc: 'Bold black patterns, Polynesian/Maori style' },
  { id: 'blackwork', name: 'Blackwork', desc: 'Solid black ink, geometric or illustrative' },
  { id: 'dotwork', name: 'Dotwork', desc: 'Made entirely of dots, mandala patterns' },
  { id: 'geometric', name: 'Geometric', desc: 'Shapes, patterns, sacred geometry' },
  { id: 'watercolor', name: 'Watercolor', desc: 'Splashes of color, paint-like effect' },
  { id: 'realism', name: 'Realism', desc: 'Photo-realistic portraits or scenes' },
  { id: 'minimalist', name: 'Minimalist', desc: 'Simple lines, small designs' },
  { id: 'chicano', name: 'Chicano', desc: 'Fine line black/gray, religious themes' },
  { id: 'biomechanical', name: 'Biomechanical', desc: 'Mechanical parts under skin' },
  { id: 'trash_polka', name: 'Trash Polka', desc: 'Black and red, chaotic collage style' },
  { id: 'anime', name: 'Anime/Manga', desc: 'Japanese animation style characters' },
];

const TATTOO_PLACEMENTS = [
  { id: 'full_sleeve_left', name: 'Full Sleeve (Left Arm)', icon: '💪' },
  { id: 'full_sleeve_right', name: 'Full Sleeve (Right Arm)', icon: '💪' },
  { id: 'half_sleeve_left', name: 'Half Sleeve (Left)', icon: '🦾' },
  { id: 'half_sleeve_right', name: 'Half Sleeve (Right)', icon: '🦾' },
  { id: 'full_back', name: 'Full Back Piece', icon: '🔙' },
  { id: 'upper_back', name: 'Upper Back', icon: '⬆️' },
  { id: 'lower_back', name: 'Lower Back', icon: '⬇️' },
  { id: 'chest', name: 'Chest Piece', icon: '💗' },
  { id: 'stomach', name: 'Stomach/Abdomen', icon: '🎯' },
  { id: 'side_ribs', name: 'Side/Ribs', icon: '📐' },
  { id: 'full_leg_left', name: 'Full Leg (Left)', icon: '🦵' },
  { id: 'full_leg_right', name: 'Full Leg (Right)', icon: '🦵' },
  { id: 'thigh_left', name: 'Thigh (Left)', icon: '🍗' },
  { id: 'thigh_right', name: 'Thigh (Right)', icon: '🍗' },
  { id: 'calf_left', name: 'Calf (Left)', icon: '🦿' },
  { id: 'calf_right', name: 'Calf (Right)', icon: '🦿' },
  { id: 'neck', name: 'Neck', icon: '🎀' },
  { id: 'hand_left', name: 'Hand (Left)', icon: '🤚' },
  { id: 'hand_right', name: 'Hand (Right)', icon: '✋' },
  { id: 'face', name: 'Face', icon: '😶' },
  { id: 'collarbone', name: 'Collarbone', icon: '📿' },
  { id: 'shoulder_left', name: 'Shoulder (Left)', icon: '🔘' },
  { id: 'shoulder_right', name: 'Shoulder (Right)', icon: '🔘' },
  { id: 'hip_left', name: 'Hip (Left)', icon: '🍑' },
  { id: 'hip_right', name: 'Hip (Right)', icon: '🍑' },
  { id: 'ankle_left', name: 'Ankle (Left)', icon: '⭕' },
  { id: 'ankle_right', name: 'Ankle (Right)', icon: '⭕' },
  { id: 'wrist_left', name: 'Wrist (Left)', icon: '⌚' },
  { id: 'wrist_right', name: 'Wrist (Right)', icon: '⌚' },
  { id: 'finger', name: 'Finger(s)', icon: '👆' },
  { id: 'behind_ear', name: 'Behind Ear', icon: '👂' },
];

const TATTOO_SUBJECTS = [
  { id: 'dragon', name: 'Dragon', emoji: '🐉' },
  { id: 'phoenix', name: 'Phoenix', emoji: '🔥' },
  { id: 'koi_fish', name: 'Koi Fish', emoji: '🐟' },
  { id: 'snake', name: 'Snake/Serpent', emoji: '🐍' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯' },
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'wolf', name: 'Wolf', emoji: '🐺' },
  { id: 'eagle', name: 'Eagle', emoji: '🦅' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
  { id: 'skull', name: 'Skull', emoji: '💀' },
  { id: 'rose', name: 'Rose', emoji: '🌹' },
  { id: 'cherry_blossom', name: 'Cherry Blossoms', emoji: '🌸' },
  { id: 'lotus', name: 'Lotus Flower', emoji: '🪷' },
  { id: 'peony', name: 'Peony', emoji: '🌺' },
  { id: 'mandala', name: 'Mandala', emoji: '☸️' },
  { id: 'cross', name: 'Cross/Religious', emoji: '✝️' },
  { id: 'angel', name: 'Angel', emoji: '👼' },
  { id: 'demon', name: 'Demon/Devil', emoji: '😈' },
  { id: 'samurai', name: 'Samurai', emoji: '⚔️' },
  { id: 'geisha', name: 'Geisha', emoji: '👘' },
  { id: 'oni_mask', name: 'Oni Mask', emoji: '👹' },
  { id: 'hannya', name: 'Hannya Mask', emoji: '👺' },
  { id: 'waves', name: 'Waves/Water', emoji: '🌊' },
  { id: 'moon', name: 'Moon', emoji: '🌙' },
  { id: 'sun', name: 'Sun', emoji: '☀️' },
  { id: 'stars', name: 'Stars', emoji: '⭐' },
  { id: 'clock', name: 'Clock/Time', emoji: '⏰' },
  { id: 'compass', name: 'Compass', emoji: '🧭' },
  { id: 'anchor', name: 'Anchor', emoji: '⚓' },
  { id: 'heart', name: 'Heart', emoji: '❤️' },
  { id: 'dagger', name: 'Dagger/Knife', emoji: '🗡️' },
  { id: 'sword', name: 'Sword', emoji: '⚔️' },
  { id: 'crown', name: 'Crown', emoji: '👑' },
  { id: 'wings', name: 'Wings', emoji: '🪽' },
  { id: 'feather', name: 'Feather', emoji: '🪶' },
  { id: 'eye', name: 'Eye', emoji: '👁️' },
  { id: 'portrait', name: 'Portrait', emoji: '🖼️' },
  { id: 'quote', name: 'Quote/Text', emoji: '📝' },
  { id: 'barcode', name: 'Barcode', emoji: '📊' },
  { id: 'geometric_shapes', name: 'Geometric Shapes', emoji: '🔷' },
];

const TATTOO_COVERAGE = [
  { id: 'single_small', name: 'Single Small Tattoo', value: 5 },
  { id: 'few_small', name: 'Few Small Tattoos', value: 15 },
  { id: 'scattered', name: 'Scattered Pieces', value: 25 },
  { id: 'moderate', name: 'Moderate Coverage', value: 40 },
  { id: 'heavy', name: 'Heavy Coverage', value: 60 },
  { id: 'very_heavy', name: 'Very Heavy Coverage', value: 75 },
  { id: 'full_body', name: 'Full Body Suit', value: 90 },
];

const SLIDE_ICONS = {
  'Breast Size': '🍈',
  'Hip Size': '🍑',
  'Thigh Thickness': '🦵',
  'Glute Size': '🍑',
  'Arm Size': '💪',
  'Tattoos': '🎨'
};

const SLIDE_COLORS = {
  'Breast Size': { primary: '#ff00ff', secondary: '#ec4899' },
  'Hip Size': { primary: '#8b5cf6', secondary: '#a855f7' },
  'Thigh Thickness': { primary: '#00ffff', secondary: '#06b6d4' },
  'Glute Size': { primary: '#ff6b6b', secondary: '#f97316' },
  'Arm Size': { primary: '#4ecdc4', secondary: '#10b981' },
  'Tattoos': { primary: '#8b5cf6', secondary: '#ec4899' }
};

export default function AttributeCarousel({ gender = 'Fem', onAttributesChange }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [attributes, setAttributes] = useState({
    breastSize: gender === 'Fem' ? '34C' : null,
    hipSize: 'Average',
    thighThickness: 'Average',
    gluteSize: 'Average',
    armSize: 'Athletic',
    hasTattoos: false,
    tattooStyles: [],
    tattooPlacements: [],
    tattooSubjects: [],
    tattooCoverage: 'moderate',
    tattooColors: 'full_color',
    tattooCustomDescription: '',
  });

  const slides = gender === 'Fem'
    ? ['Breast Size', 'Hip Size', 'Thigh Thickness', 'Glute Size', 'Tattoos']
    : ['Arm Size', 'Hip Size', 'Thigh Thickness', 'Glute Size', 'Tattoos'];

  const updateAttribute = (key, value) => {
    const newAttributes = { ...attributes, [key]: value };
    setAttributes(newAttributes);
    onAttributesChange?.(newAttributes);
  };

  const toggleArrayItem = (key, item) => {
    const current = attributes[key] || [];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateAttribute(key, updated);
  };

  const navigateSlide = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === 'next') {
      setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    } else {
      setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentSlideName = slides[currentSlide];
  const colors = SLIDE_COLORS[currentSlideName];

  const renderSliderContent = () => {
    switch (currentSlideName) {
      case 'Breast Size':
        return (
          <SliderPanel
            title="Breast Size"
            icon="🍈"
            minLabel="20D"
            maxLabel="60GG"
            value={attributes.breastSize}
            options={BREAST_SIZES}
            onChange={(val) => updateAttribute('breastSize', val)}
            color={colors.primary}
            sliderClass="slider-pink"
          />
        );

      case 'Hip Size':
        return (
          <SliderPanel
            title="Hip Width"
            icon="🍑"
            minLabel="Narrow"
            maxLabel="BBL"
            value={attributes.hipSize}
            options={HIP_SIZES}
            onChange={(val) => updateAttribute('hipSize', val)}
            color={colors.primary}
            sliderClass="slider-purple"
          />
        );

      case 'Thigh Thickness':
        return (
          <SliderPanel
            title="Thigh Thickness"
            icon="🦵"
            minLabel="Slim"
            maxLabel="Thicc"
            value={attributes.thighThickness}
            options={THIGH_SIZES}
            onChange={(val) => updateAttribute('thighThickness', val)}
            color={colors.primary}
            sliderClass="slider-cyan"
          />
        );

      case 'Glute Size':
        return (
          <SliderPanel
            title="Glute Size"
            icon="🍑"
            minLabel="Flat"
            maxLabel="BBL"
            value={attributes.gluteSize}
            options={GLUTE_SIZES}
            onChange={(val) => updateAttribute('gluteSize', val)}
            color={colors.primary}
            sliderClass="slider-orange"
          />
        );

      case 'Arm Size':
        return (
          <SliderPanel
            title="Arm Muscularity"
            icon="💪"
            minLabel="Lean"
            maxLabel="Massive"
            value={attributes.armSize}
            options={ARM_SIZES}
            onChange={(val) => updateAttribute('armSize', val)}
            color={colors.primary}
            sliderClass="slider-green"
          />
        );

      case 'Tattoos':
        return <TattooPanel attributes={attributes} updateAttribute={updateAttribute} toggleArrayItem={toggleArrayItem} />;

      default:
        return null;
    }
  };

  // Generate tattoo summary for display
  const getTattooSummary = () => {
    if (!attributes.hasTattoos) return null;
    const parts = [];
    if (attributes.tattooStyles.length > 0) parts.push(`${attributes.tattooStyles.length} styles`);
    if (attributes.tattooPlacements.length > 0) parts.push(`${attributes.tattooPlacements.length} areas`);
    if (attributes.tattooSubjects.length > 0) parts.push(`${attributes.tattooSubjects.length} designs`);
    return parts.length > 0 ? parts.join(', ') : 'Tattoos';
  };

  return (
    <div className="w-full">
      {/* Carousel Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {slides.map((slide, index) => (
          <button
            key={slide}
            onClick={() => setCurrentSlide(index)}
            className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              currentSlide === index
                ? 'bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] text-white shadow-lg shadow-[rgba(255,0,255,0.3)] scale-105'
                : 'bg-[rgba(20,10,40,0.6)] text-gray-400 border border-[rgba(139,92,246,0.3)] hover:border-[#ff00ff] hover:text-white'
            }`}
          >
            <span>{SLIDE_ICONS[slide]}</span>
            <span className="hidden sm:inline">{slide}</span>
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide
                ? 'w-12 bg-gradient-to-r from-[#ff00ff] to-[#00ffff]'
                : 'w-4 bg-[rgba(139,92,246,0.3)]'
            }`}
          />
        ))}
      </div>

      {/* Slider Content */}
      <div className={`relative transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-[rgba(15,5,30,0.5)] rounded-2xl p-8 border border-[rgba(139,92,246,0.2)]">
          {renderSliderContent()}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => navigateSlide('prev')}
          className="carousel-nav group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
        </button>

        <div className="text-center">
          <span className="text-gray-500 text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        <button
          onClick={() => navigateSlide('next')}
          className="carousel-nav group"
        >
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Current Attributes Summary */}
      <div className="mt-8 p-4 bg-[rgba(10,0,21,0.5)] rounded-xl border border-[rgba(139,92,246,0.2)]">
        <h4 className="text-sm text-gray-500 mb-3 text-center">Current Selection</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {gender === 'Fem' && attributes.breastSize && (
            <span className="badge badge-pink">{attributes.breastSize}</span>
          )}
          {gender === 'Masc' && (
            <span className="badge badge-cyan">{attributes.armSize}</span>
          )}
          <span className="badge badge-purple">{attributes.hipSize}</span>
          <span className="badge badge-cyan">{attributes.thighThickness}</span>
          <span className="badge badge-pink">{attributes.gluteSize}</span>
          {attributes.hasTattoos && (
            <span className="badge badge-purple">🎨 {getTattooSummary()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Tattoo Configuration Panel
function TattooPanel({ attributes, updateAttribute, toggleArrayItem }) {
  const [activeTab, setActiveTab] = useState('toggle');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-5xl mb-4 block">🎨</span>
        <h3 className="text-2xl font-bold text-white mb-2">Tattoos</h3>
      </div>

      {/* Main Toggle */}
      <div
        className="flex items-center justify-center gap-4 cursor-pointer group"
        onClick={() => updateAttribute('hasTattoos', !attributes.hasTattoos)}
      >
        <div className={`relative w-16 h-8 rounded-full transition-all ${
          attributes.hasTattoos
            ? 'bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6]'
            : 'bg-[rgba(139,92,246,0.3)]'
        }`}>
          <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all ${
            attributes.hasTattoos ? 'left-9' : 'left-1'
          }`}></div>
        </div>
        <span className="text-white text-lg font-semibold">
          {attributes.hasTattoos ? 'Tattoos Enabled' : 'No Tattoos'}
        </span>
      </div>

      {/* Tattoo Configuration */}
      {attributes.hasTattoos && (
        <div className="space-y-6 animate-fade-in">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'style', label: 'Style', icon: '🎭' },
              { id: 'placement', label: 'Placement', icon: '📍' },
              { id: 'subject', label: 'Design', icon: '🖼️' },
              { id: 'coverage', label: 'Coverage', icon: '📊' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] text-white'
                    : 'bg-[rgba(139,92,246,0.2)] text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'style' && attributes.tattooStyles.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{attributes.tattooStyles.length}</span>
                )}
                {tab.id === 'placement' && attributes.tattooPlacements.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{attributes.tattooPlacements.length}</span>
                )}
                {tab.id === 'subject' && attributes.tattooSubjects.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{attributes.tattooSubjects.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Style Selection */}
          {activeTab === 'style' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">Select tattoo style(s):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2">
                {TATTOO_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => toggleArrayItem('tattooStyles', style.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      attributes.tattooStyles.includes(style.id)
                        ? 'bg-gradient-to-r from-[#ff00ff]/30 to-[#8b5cf6]/30 border-2 border-[#ff00ff]'
                        : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] hover:border-[#ff00ff]'
                    }`}
                  >
                    <div className="font-semibold text-white text-sm">{style.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Placement Selection */}
          {activeTab === 'placement' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">Select tattoo placement(s):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2">
                {TATTOO_PLACEMENTS.map(place => (
                  <button
                    key={place.id}
                    onClick={() => toggleArrayItem('tattooPlacements', place.id)}
                    className={`p-3 rounded-xl text-left transition-all flex items-center gap-2 ${
                      attributes.tattooPlacements.includes(place.id)
                        ? 'bg-gradient-to-r from-[#00ffff]/30 to-[#3b82f6]/30 border-2 border-[#00ffff]'
                        : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] hover:border-[#00ffff]'
                    }`}
                  >
                    <span className="text-xl">{place.icon}</span>
                    <span className="font-semibold text-white text-sm">{place.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject/Design Selection */}
          {activeTab === 'subject' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">Select tattoo design(s):</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2">
                {TATTOO_SUBJECTS.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => toggleArrayItem('tattooSubjects', subject.id)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      attributes.tattooSubjects.includes(subject.id)
                        ? 'bg-gradient-to-r from-[#8b5cf6]/30 to-[#ec4899]/30 border-2 border-[#8b5cf6]'
                        : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] hover:border-[#8b5cf6]'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{subject.emoji}</span>
                    <span className="text-xs text-white">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coverage Selection */}
          {activeTab === 'coverage' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 text-center">Select coverage level:</p>

              {/* Coverage Slider Visual */}
              <div className="flex justify-between items-center px-4">
                <span className="text-sm text-gray-400">Minimal</span>
                <span className="text-sm text-gray-400">Full Body</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {TATTOO_COVERAGE.map(coverage => (
                  <button
                    key={coverage.id}
                    onClick={() => updateAttribute('tattooCoverage', coverage.id)}
                    className={`p-4 rounded-xl transition-all flex items-center justify-between ${
                      attributes.tattooCoverage === coverage.id
                        ? 'bg-gradient-to-r from-[#ff00ff]/30 to-[#00ffff]/30 border-2 border-[#ff00ff]'
                        : 'bg-[rgba(20,10,40,0.6)] border border-[rgba(139,92,246,0.3)] hover:border-[#ff00ff]'
                    }`}
                  >
                    <span className="font-semibold text-white">{coverage.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[rgba(139,92,246,0.3)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ff00ff] to-[#00ffff] rounded-full"
                          style={{ width: `${coverage.value}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{coverage.value}%</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Color Option */}
              <div className="pt-4 border-t border-[rgba(139,92,246,0.2)]">
                <p className="text-sm text-gray-400 mb-3">Tattoo Colors:</p>
                <div className="flex gap-3 justify-center">
                  {[
                    { id: 'full_color', name: 'Full Color', icon: '🌈' },
                    { id: 'black_gray', name: 'Black & Gray', icon: '⬛' },
                    { id: 'black_red', name: 'Black & Red', icon: '🔴' },
                    { id: 'black_only', name: 'Black Only', icon: '⚫' },
                  ].map(color => (
                    <button
                      key={color.id}
                      onClick={() => updateAttribute('tattooColors', color.id)}
                      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        attributes.tattooColors === color.id
                          ? 'bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] text-white'
                          : 'bg-[rgba(139,92,246,0.2)] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{color.icon}</span>
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Description */}
          <div className="pt-4 border-t border-[rgba(139,92,246,0.2)]">
            <label className="block text-sm text-gray-400 mb-2">Additional details (optional):</label>
            <textarea
              placeholder="e.g., 'Faded/aged look', 'Glowing neon effect', 'Fresh with redness'..."
              value={attributes.tattooCustomDescription}
              onChange={(e) => updateAttribute('tattooCustomDescription', e.target.value)}
              className="neon-input resize-none text-sm"
              rows="2"
            />
          </div>

          {/* Selection Summary */}
          {(attributes.tattooStyles.length > 0 || attributes.tattooPlacements.length > 0 || attributes.tattooSubjects.length > 0) && (
            <div className="p-4 bg-[rgba(255,0,255,0.1)] rounded-xl border border-[rgba(255,0,255,0.3)]">
              <h4 className="text-sm font-semibold text-[#ff00ff] mb-2">Your Tattoo Configuration:</h4>
              <div className="flex flex-wrap gap-1">
                {attributes.tattooStyles.map(id => {
                  const style = TATTOO_STYLES.find(s => s.id === id);
                  return style && <span key={id} className="badge badge-pink text-xs">{style.name}</span>;
                })}
                {attributes.tattooPlacements.map(id => {
                  const place = TATTOO_PLACEMENTS.find(p => p.id === id);
                  return place && <span key={id} className="badge badge-cyan text-xs">{place.name}</span>;
                })}
                {attributes.tattooSubjects.map(id => {
                  const subject = TATTOO_SUBJECTS.find(s => s.id === id);
                  return subject && <span key={id} className="badge badge-purple text-xs">{subject.emoji} {subject.name}</span>;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Reusable Slider Panel Component
function SliderPanel({ title, icon, minLabel, maxLabel, value, options, onChange, color, sliderClass }) {
  const index = options.indexOf(value);
  const percentage = (index / (options.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-5xl mb-4 block">{icon}</span>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>

      {/* Value Display */}
      <div className="text-center">
        <div
          className="text-4xl md:text-5xl font-black mb-2 transition-all"
          style={{
            color: color,
            textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40`
          }}
        >
          {value}
        </div>
        <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-transparent via-current to-transparent"
             style={{ color: color }} />
      </div>

      {/* Slider */}
      <div className="px-4">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>

        <div className="relative">
          {/* Progress Track */}
          <div
            className="absolute top-1/2 left-0 h-2 rounded-full -translate-y-1/2 transition-all"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${color}80, ${color})`
            }}
          />

          <input
            type="range"
            min="0"
            max={options.length - 1}
            value={index >= 0 ? index : 0}
            onChange={(e) => onChange(options[parseInt(e.target.value)])}
            className={`w-full h-2 bg-[rgba(139,92,246,0.2)] rounded-full appearance-none cursor-pointer relative z-10 ${sliderClass}`}
          />
        </div>

        {/* Tick Marks */}
        <div className="flex justify-between px-1 mt-2">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className={`w-1 h-1 rounded-full ${
                percentage >= tick ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

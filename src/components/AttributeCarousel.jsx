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
    tattooDescription: '',
  });

  const slides = gender === 'Fem'
    ? ['Breast Size', 'Hip Size', 'Thigh Thickness', 'Glute Size', 'Tattoos']
    : ['Arm Size', 'Hip Size', 'Thigh Thickness', 'Glute Size', 'Tattoos'];

  const updateAttribute = (key, value) => {
    const newAttributes = { ...attributes, [key]: value };
    setAttributes(newAttributes);
    onAttributesChange?.(newAttributes);
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
        return (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl mb-4 block">🎨</span>
              <h3 className="text-2xl font-bold text-white mb-2">Tattoos</h3>
            </div>

            <label className="flex items-center justify-center gap-4 cursor-pointer group">
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
            </label>

            <input
              type="checkbox"
              checked={attributes.hasTattoos}
              onChange={(e) => updateAttribute('hasTattoos', e.target.checked)}
              className="hidden"
            />

            {attributes.hasTattoos && (
              <div className="animate-fade-in">
                <label className="block text-sm text-gray-400 mb-2">Describe the tattoos:</label>
                <textarea
                  placeholder="e.g., Full sleeve on left arm with Japanese dragon, small rose on shoulder..."
                  value={attributes.tattooDescription}
                  onChange={(e) => updateAttribute('tattooDescription', e.target.value)}
                  className="neon-input resize-none"
                  rows="3"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
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
            <span className="badge badge-purple">+ Tattoos</span>
          )}
        </div>
      </div>
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

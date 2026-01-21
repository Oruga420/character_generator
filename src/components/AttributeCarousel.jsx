'use client';

import { useState } from 'react';

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

export default function AttributeCarousel({ gender = 'Fem', onAttributesChange }) {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const renderSlider = () => {
    const currentSlideName = slides[currentSlide];

    switch (currentSlideName) {
      case 'Breast Size':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Breast Size</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">20D</span>
              <span className="text-3xl font-bold text-pink-400">{attributes.breastSize}</span>
              <span className="text-gray-300">60GG</span>
            </div>
            <input
              type="range"
              min="0"
              max={BREAST_SIZES.length - 1}
              value={BREAST_SIZES.indexOf(attributes.breastSize)}
              onChange={(e) => updateAttribute('breastSize', BREAST_SIZES[e.target.value])}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
            />
            <div className="text-sm text-gray-400 text-center">
              Slide to adjust breast size
            </div>
          </div>
        );

      case 'Hip Size':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Hip Width</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Narrow</span>
              <span className="text-3xl font-bold text-purple-400">{attributes.hipSize}</span>
              <span className="text-gray-300">BBL</span>
            </div>
            <input
              type="range"
              min="0"
              max={HIP_SIZES.length - 1}
              value={HIP_SIZES.indexOf(attributes.hipSize)}
              onChange={(e) => updateAttribute('hipSize', HIP_SIZES[e.target.value])}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="text-sm text-gray-400 text-center">
              From narrow to full BBL
            </div>
          </div>
        );

      case 'Thigh Thickness':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Thigh Thickness</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Slim</span>
              <span className="text-3xl font-bold text-blue-400">{attributes.thighThickness}</span>
              <span className="text-gray-300">Very Thick</span>
            </div>
            <input
              type="range"
              min="0"
              max={THIGH_SIZES.length - 1}
              value={THIGH_SIZES.indexOf(attributes.thighThickness)}
              onChange={(e) => updateAttribute('thighThickness', THIGH_SIZES[e.target.value])}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
            />
            <div className="text-sm text-gray-400 text-center">
              Adjust thigh thickness
            </div>
          </div>
        );

      case 'Glute Size':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Glute Size</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Flat</span>
              <span className="text-3xl font-bold text-orange-400">{attributes.gluteSize}</span>
              <span className="text-gray-300">BBL</span>
            </div>
            <input
              type="range"
              min="0"
              max={GLUTE_SIZES.length - 1}
              value={GLUTE_SIZES.indexOf(attributes.gluteSize)}
              onChange={(e) => updateAttribute('gluteSize', GLUTE_SIZES[e.target.value])}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-orange"
            />
            <div className="text-sm text-gray-400 text-center">
              From flat to exaggerated BBL
            </div>
          </div>
        );

      case 'Arm Size':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Arm Muscularity</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Lean</span>
              <span className="text-3xl font-bold text-green-400">{attributes.armSize}</span>
              <span className="text-gray-300">Massive</span>
            </div>
            <input
              type="range"
              min="0"
              max={ARM_SIZES.length - 1}
              value={ARM_SIZES.indexOf(attributes.armSize)}
              onChange={(e) => updateAttribute('armSize', ARM_SIZES[e.target.value])}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-green"
            />
            <div className="text-sm text-gray-400 text-center">
              Adjust arm muscularity
            </div>
          </div>
        );

      case 'Tattoos':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Tattoos</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attributes.hasTattoos}
                  onChange={(e) => updateAttribute('hasTattoos', e.target.checked)}
                  className="w-5 h-5 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                />
                <span className="text-white">Add Tattoos</span>
              </label>
            </div>
            {attributes.hasTattoos && (
              <textarea
                placeholder="Describe the tattoos (e.g., 'sleeve tattoo on left arm, tribal design')"
                value={attributes.tattooDescription}
                onChange={(e) => updateAttribute('tattooDescription', e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="3"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Carousel Navigation */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {slides.map((slide, index) => (
          <button
            key={slide}
            onClick={() => setCurrentSlide(index)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              currentSlide === index
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-110'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {slide}
          </button>
        ))}
      </div>

      {/* Slider Content */}
      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
        {renderSlider()}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

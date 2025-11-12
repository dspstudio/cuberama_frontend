import React, { useState } from 'react';
import { SlidersHorizontal, Dices, Wand2 } from 'lucide-react';
import Tooltip from './Tooltip';

interface ShaderControlsProps {
  speed: number;
  setSpeed: (value: number) => void;
  density: number;
  setDensity: (value: number) => void;
  complexity: number;
  setComplexity: (value: number) => void;
  intensity: number;
  setIntensity: (value: number) => void;
  colorR: number;
  setColorR: (value: number) => void;
  colorG: number;
  setColorG: (value: number) => void;
  colorB: number;
  setColorB: (value: number) => void;
  zoom: number;
  setZoom: (value: number) => void;
  // Setters for the new "surprise" values
  setChaos1: (value: number) => void;
  setChaos2: (value: number) => void;
  setChaos3: (value: number) => void;
}

const Slider: React.FC<{ label: string, value: number, displayValue: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min: number, max: number, step: number, thumbClassName?: string }> = ({ label, value, displayValue, onChange, min, max, step, thumbClassName = '[&::-webkit-slider-thumb]:bg-cyan-400' }) => (
  <div>
    <label className="flex justify-between items-center text-xs text-gray-400 mb-1">
      <span>{label}</span>
      <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded">{displayValue}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ${thumbClassName}`}
    />
  </div>
);

const ShaderControls: React.FC<ShaderControlsProps> = ({ speed, setSpeed, density, setDensity, complexity, setComplexity, intensity, setIntensity, colorR, setColorR, colorG, setColorG, colorB, setColorB, zoom, setZoom, setChaos1, setChaos2, setChaos3 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRandomize = () => {
    const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    setSpeed(randomFloat(0.1, 2.0));
    setDensity(randomFloat(0.01, 0.05));
    setComplexity(randomInt(50, 150));
    setIntensity(randomFloat(0.00001, 0.00009));
    setZoom(randomFloat(0.01, 0.2));
    setColorR(randomFloat(0, 2.0));
    setColorG(randomFloat(0, 2.0));
    setColorB(randomFloat(0, 2.0));
  };

  const handleSurpriseRandomize = () => {
    // These values alter the core "magic numbers" in the shader's chaotic loop
    // for unpredictable results.
    // Default values: 2.04, 0.9, 0.7
    setChaos1(Math.random() * 4.0);       // p = abs(p * u_chaos_1) ...
    setChaos2(Math.random() * 2.0 - 0.5); // ... / dot(p,p) - u_chaos_2
    setChaos3(Math.random() * 2.0);       // v += pow(dot(p,p), u_chaos_3) ...
  };


  return (
    <div className="fixed bottom-6 right-6 z-20">
      <div 
        className={`absolute bottom-20 right-0 w-64 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-lg p-4 transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-semibold text-white">Shader Controls</h4>
          <div className="flex items-center gap-2">
            <Tooltip text="Surprise Me!" position="top">
              <button
                onClick={handleSurpriseRandomize}
                className="p-1.5 text-gray-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/70 rounded-md transition-colors"
                aria-label="Randomize shader's core algorithm"
              >
                <Wand2 size={16} />
              </button>
            </Tooltip>
            <Tooltip text="Randomize Values" position="top">
              <button
                onClick={handleRandomize}
                className="p-1.5 text-gray-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/70 rounded-md transition-colors"
                aria-label="Randomize shader settings"
              >
                <Dices size={16} />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="space-y-4">
          <Slider
            label="Speed"
            value={speed}
            displayValue={speed.toFixed(2)}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            min={0.1}
            max={2.0}
            step={0.01}
          />
          <Slider
            label="Density"
            value={density}
            displayValue={density.toFixed(3)}
            onChange={(e) => setDensity(parseFloat(e.target.value))}
            min={0.01}
            max={0.05}
            step={0.001}
          />
          <Slider
            label="Complexity"
            value={complexity}
            displayValue={complexity.toFixed(0)}
            onChange={(e) => setComplexity(parseFloat(e.target.value))}
            min={50}
            max={150}
            step={1}
          />
          <Slider
            label="Intensity"
            value={intensity}
            displayValue={(intensity * 1000000).toFixed(1)}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            min={0.00001}
            max={0.00009}
            step={0.000001}
          />
          <Slider
            label="Zoom"
            value={zoom}
            displayValue={zoom.toFixed(3)}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            min={0.01}
            max={0.2}
            step={0.001}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <h5 className="text-xs font-semibold text-white mb-3">Color Tint</h5>
          <div className="space-y-4">
            <Slider
              label="Red"
              value={colorR}
              displayValue={colorR.toFixed(2)}
              onChange={(e) => setColorR(parseFloat(e.target.value))}
              min={0}
              max={2.0}
              step={0.01}
              thumbClassName="[&::-webkit-slider-thumb]:bg-red-500"
            />
            <Slider
              label="Green"
              value={colorG}
              displayValue={colorG.toFixed(2)}
              onChange={(e) => setColorG(parseFloat(e.target.value))}
              min={0}
              max={2.0}
              step={0.01}
              thumbClassName="[&::-webkit-slider-thumb]:bg-green-500"
            />
            <Slider
              label="Blue"
              value={colorB}
              displayValue={colorB.toFixed(2)}
              onChange={(e) => setColorB(parseFloat(e.target.value))}
              min={0}
              max={2.0}
              step={0.01}
              thumbClassName="[&::-webkit-slider-thumb]:bg-blue-500"
            />
          </div>
        </div>

      </div>
      <Tooltip text="Shader Controls" position="left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-r from-blue-700 to-cyan-800 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 hover:from-blue-600 hover:to-cyan-700 transition-all duration-300"
          aria-label="Toggle shader controls"
          aria-expanded={isOpen}
        >
          <SlidersHorizontal size={24} />
        </button>
      </Tooltip>
    </div>
  );
};

export default ShaderControls;
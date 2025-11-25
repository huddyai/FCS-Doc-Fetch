import React, { useState, useEffect } from 'react';

export const ProgressLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  const logs = [
    "Initializing generative models...",
    "Parsing user intent parameters...",
    "Connecting to live regulatory index...",
    "Scanning state compliance databases...",
    "Retrieving structural templates...",
    "Analyzing zoning variance precedents...",
    "Synthesizing legal framework...",
    "Drafting executive summary...",
    "Compiling mitigation measures...",
    "Formatting document structure...",
    "Finalizing editable output..."
  ];

  useEffect(() => {
    // Progress bar animation with asymptotic decay
    // It starts fast and slows down as it approaches 95%, never hitting 100% on its own.
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Stop automatically advancing if we reach 95%
        if (prev >= 95) {
          return 95;
        }
        
        // Calculate increment based on remaining distance to 95
        // This creates a Zeno's paradox effect: fast at start, very slow at end
        const target = 95;
        const distance = target - prev;
        // The divisor (30) controls the speed curve. Higher = slower approach.
        // Math.random() adds a bit of "organic" stutter.
        const increment = (distance / 40) + (Math.random() * 0.2);
        
        return prev + increment;
      });
    }, 200);

    // Log text animation
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % logs.length);
    }, 2000); // Slower log rotation to match longer load times

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 min-h-[500px]">
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Outer Ring - Slow Rotate */}
        <div className="absolute inset-0 rounded-full border-4 border-navy-100 border-t-navy-500 animate-[spin_3s_linear_infinite]"></div>
        
        {/* Middle Ring - Medium Rotate Reverse */}
        <div className="absolute inset-4 rounded-full border-2 border-fcs-green-100 border-b-fcs-green-500 animate-[spin_2s_linear_infinite_reverse]"></div>
        
        {/* Inner Ring - Fast Rotate */}
        <div className="absolute inset-12 rounded-full border border-dashed border-navy-300 animate-[spin_4s_linear_infinite]"></div>
        
        {/* Core Pulsing */}
        <div className="absolute w-24 h-24 bg-gradient-to-br from-fcs-green to-navy-600 rounded-full blur-md opacity-20 animate-pulse"></div>
        <div className="absolute w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
          <span className="text-2xl font-bold text-navy-800 font-mono">{Math.floor(progress)}%</span>
        </div>
        
        {/* Orbiting particles */}
        <div className="absolute w-full h-full animate-[spin_5s_linear_infinite]">
            <div className="w-3 h-3 bg-fcs-green rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 shadow-[0_0_10px_#92C973]"></div>
        </div>
      </div>

      <div className="max-w-md w-full text-center space-y-4 z-10">
        <h3 className="text-xl font-bold text-navy-900 tracking-tight uppercase">
          Generating Professional Draft
        </h3>
        
        {/* Terminal / Log Window */}
        <div className="bg-navy-900 rounded-lg p-4 font-mono text-xs text-left shadow-xl border border-navy-700 h-24 overflow-hidden relative">
          <div className="absolute top-2 right-2 flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="space-y-1 mt-2">
            <div className="text-gray-500 opacity-50">{logs[(logIndex - 2 + logs.length) % logs.length]}</div>
            <div className="text-gray-400 opacity-75">{logs[(logIndex - 1 + logs.length) % logs.length]}</div>
            <div className="text-fcs-green font-bold flex items-center">
              <span className="mr-2 text-fcs-green-400">➜</span>
              {logs[logIndex]}
              <span className="animate-pulse ml-1">_</span>
            </div>
          </div>
        </div>
        
        <p className="text-navy-400 text-sm">
          FCS AI is synthesizing live regulatory data into your document.
        </p>
      </div>
    </div>
  );
};
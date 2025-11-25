import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { InteractiveBackground } from './InteractiveBackground';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const triggerSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSearch();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to calculate new scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const fcsUseCases = [
    'Environmental Impact Report (EIR)',
    'Environmental Assessment (EA)',
    'Initial Study (IS)',
    'Regulatory Compliance Permit',
    'Mitigation Monitoring Plan',
    'Air Quality Report',
    'Land Use & Zoning Document'
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Interactive Background */}
      <InteractiveBackground />
      
      {/* Subtle overlay to ensure text contrast at the very top if needed, though canvas is light */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/60 via-transparent to-white/80 pointer-events-none z-1"></div>
      
      <div className="relative z-10 text-center max-w-4xl w-full">
        <span className="inline-block py-1 px-3 rounded-full bg-navy-50 border border-navy-100 text-navy-600 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-sm bg-opacity-80">
          First Carbon Solutions AI Tool
        </span>
        
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-900 mb-6 leading-tight drop-shadow-sm">
          Intelligent Document Retrieval & <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fcs-green to-navy-600">Generation for Compliance</span>
        </h2>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Doc Fetch searches <span className="font-bold text-navy-700 bg-navy-50 px-1 rounded">live regulatory sources</span> to analyze structure and intent, then generates <span className="font-bold text-fcs-green-600 bg-fcs-green-50 px-1 rounded">brand-new, legally unique, and fully editable</span> professional drafts for your <span className="font-bold text-navy-700 bg-navy-50 px-1 rounded">environmental and planning needs</span>.
        </p>

        <form onSubmit={handleFormSubmit} className="relative w-full max-w-3xl mx-auto mb-20 px-2 sm:px-0">
          <div className="relative group transition-transform duration-300 ease-out hover:-translate-y-1">
            {/* Deep 3D Shadow / Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-fcs-green via-navy-500 to-navy-700 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500 will-change-transform"></div>
            
            {/* Main Search Card */}
            <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(45,71,92,0.3)] ring-1 ring-gray-100 flex items-center p-3 z-10">
              <div className="pl-4 pr-3 text-navy-400 self-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <textarea
                ref={textareaRef}
                rows={1}
                className="block w-full border-0 bg-transparent p-4 text-gray-900 placeholder-gray-400 focus:ring-0 text-xl outline-none font-medium resize-none overflow-hidden"
                placeholder="Describe the document you need..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ minHeight: '60px' }}
              />
              <div className="pr-1 hidden sm:block self-center">
                <Button 
                  type="submit" 
                  disabled={!query.trim() || isLoading} 
                  isLoading={isLoading}
                  className="rounded-xl px-8 py-4 text-base font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Generate Draft
                </Button>
              </div>
            </div>
            {/* Mobile Button (outside flex on very small screens if needed, but hiding inside for now) */}
          </div>
          <div className="mt-4 sm:hidden">
            <Button 
              type="submit" 
              disabled={!query.trim() || isLoading} 
              isLoading={isLoading}
              className="w-full rounded-xl py-3 text-base font-bold shadow-lg"
            >
              Generate Draft
            </Button>
          </div>
        </form>
        
        <div className="w-full max-w-5xl mx-auto perspective-1000">
          <p className="text-sm font-bold text-navy-300 uppercase tracking-widest mb-8 text-shadow-sm">
            Optimized for FCS Workflows
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {fcsUseCases.map((useCase) => (
              <button
                key={useCase}
                type="button"
                onClick={() => {
                  setQuery(useCase);
                  onSearch(useCase);
                }}
                className="group relative inline-flex items-center px-5 py-3 bg-white border border-gray-100 border-b-[4px] border-b-gray-200 rounded-xl text-sm font-semibold text-navy-600 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-b-fcs-green hover:text-navy-900 active:translate-y-0.5 active:border-b-0 active:shadow-inner"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-2.5 group-hover:bg-fcs-green transition-colors duration-300"></span>
                {useCase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
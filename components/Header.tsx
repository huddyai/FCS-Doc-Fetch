import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white border-b border-navy-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center cursor-pointer group" onClick={onReset}>
          {/* Custom FCS Logo */}
          <div className="mr-3 flex items-center justify-center">
            <svg width="52" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <text x="0" y="24" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#0f172a" letterSpacing="-1">FCS</text>
              {/* Updated dots to FCS Green #92C973 */}
              <circle cx="48" cy="12" r="3" fill="#92C973" />
              <circle cx="55" cy="7" r="3" fill="#92C973" />
              <circle cx="62" cy="2" r="3" fill="#92C973" />
            </svg>
          </div>
          
          <div className="h-6 w-px bg-gray-300 mx-3 hidden sm:block"></div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-navy-900 tracking-tight leading-none">Doc Fetch</h1>
            <span className="text-[10px] font-medium text-navy-500 tracking-wide uppercase mt-0.5">By First Carbon Solutions</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 text-xs font-medium text-navy-600">
               <span className="w-2 h-2 rounded-full bg-fcs-green-500 animate-pulse"></span>
               <span>System Online</span>
            </div>
            <span className="text-xs font-semibold text-fcs-green-600 uppercase tracking-wider bg-fcs-green-50 px-3 py-1.5 rounded-full border border-fcs-green-200 hidden sm:block">
              Enterprise AI
            </span>
        </div>
      </div>
    </header>
  );
};
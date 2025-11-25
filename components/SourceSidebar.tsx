import React from 'react';
import { Source } from '../types';

interface SourceSidebarProps {
  sources: Source[];
}

export const SourceSidebar: React.FC<SourceSidebarProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 lg:h-[calc(100vh-64px)] overflow-y-auto p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <h3 className="text-xs font-bold text-navy-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
        Analyzed Sources
      </h3>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-gray-50 border border-gray-100 rounded-lg hover:shadow-md hover:border-fcs-green hover:bg-white transition-all duration-200 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-3.5 w-3.5 text-fcs-green group-hover:text-fcs-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-navy-900 group-hover:text-fcs-green-700 line-clamp-2 leading-snug">
                  {source.title}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 truncate font-mono">
                  {new URL(source.uri).hostname}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-navy-50 rounded-lg border border-navy-100">
        <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-navy-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-navy-800 leading-relaxed">
              <strong>FCS Draft Generation:</strong> This document was synthesized from the public sources listed above. It mimics the structure and compliance requirements found in similar documents.
            </p>
        </div>
      </div>
    </div>
  );
};
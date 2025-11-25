import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { DocumentEditor } from './components/DocumentEditor';
import { SourceSidebar } from './components/SourceSidebar';
import { ProgressLoader } from './components/ProgressLoader';
import { fetchDocumentDraft } from './services/geminiService';
import { AppState, Source } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentQuery, setCurrentQuery] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setAppState(AppState.SEARCHING);
    setCurrentQuery(query);
    setError(null);
    setSources([]);
    setDocumentContent('');

    try {
      // Transition to Generating purely for visual feedback if we wanted finer granularity
      // But we will just wait for the promise.
      const result = await fetchDocumentDraft(query);
      
      setDocumentContent(result.content);
      setSources(result.sources);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError("We encountered an issue while searching and drafting your document. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentQuery('');
    setDocumentContent('');
    setSources([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header onReset={handleReset} />

      <main className="flex-1 flex flex-col">
        {appState === AppState.IDLE && (
          <SearchHero onSearch={handleSearch} isLoading={false} />
        )}

        {appState === AppState.SEARCHING && (
          <ProgressLoader />
        )}

        {appState === AppState.ERROR && (
           <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bg-red-50 p-6 rounded-lg max-w-md text-center border border-red-100">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-red-900">Generation Failed</h3>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <div className="mt-6">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                </div>
            </div>
           </div>
        )}

        {appState === AppState.COMPLETE && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
             {/* Sidebar on Desktop, maybe stacked on mobile */}
             <div className="hidden lg:block">
                <SourceSidebar sources={sources} />
             </div>
             
             {/* Main Editor */}
             <DocumentEditor initialContent={documentContent} title={currentQuery} />
             
             {/* Mobile Sources Drawer could go here, but for simplicity we hide sidebar on small screens or we could render it below */}
             <div className="lg:hidden p-4 bg-gray-50 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Sources</h3>
                <ul className="list-disc pl-5 text-sm text-blue-600">
                    {sources.map((s, i) => (
                        <li key={i}><a href={s.uri} target="_blank" rel="noreferrer">{s.title}</a></li>
                    ))}
                </ul>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
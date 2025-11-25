import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
// @ts-ignore
import { jsPDF } from "jspdf";

interface DocumentEditorProps {
  initialContent: string;
  title: string;
}

const ToolbarButton: React.FC<{ 
  onClick: () => void; 
  icon: React.ReactNode; 
  title: string; 
}> = ({ onClick, icon, title }) => (
  <button
    type="button"
    onClick={(e) => {
        e.preventDefault();
        onClick();
    }}
    title={title}
    className="p-2 text-gray-500 hover:text-fcs-green-600 hover:bg-fcs-green-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-fcs-green-200"
  >
    {icon}
  </button>
);

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialContent, title }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Initialize content with basic formatting from markdown
  useEffect(() => {
    if (editorRef.current) {
        // Simple formatter to make AI text look good
        let formatted = initialContent
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            // Italic
            .replace(/\*(.*?)\*/g, '<i>$1</i>')
            // Lists - Replace markdown list syntax with visual bullets (not true <ul> for simplicity in regex, but good enough for initial view)
            .replace(/^- (.*$)/gm, '• $1')
            // Newlines
            .replace(/\n/g, '<br>');

        editorRef.current.innerHTML = formatted;
    }
  }, [initialContent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };

    if (isDownloadMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadMenuOpen]);

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        editorRef.current.focus();
    }
  };

  const handleCopy = () => {
    if (editorRef.current) {
        navigator.clipboard.writeText(editorRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadFile = (format: 'txt' | 'md' | 'html' | 'rtf' | 'pdf') => {
    if (!editorRef.current) return;
    
    const textContent = editorRef.current.innerText;
    const htmlContent = editorRef.current.innerHTML;
    const safeTitle = title.slice(0, 30).replace(/\s+/g, '_').toLowerCase();

    if (format === 'pdf') {
        const doc = new jsPDF();
        const pageWidth = 190; // A4 width approx 210mm - margins
        const margin = 15;
        let y = 20;

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        const titleLines = doc.splitTextToSize(title, pageWidth);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 10;

        // Content (Plain text extraction for robust PDF generation)
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const contentLines = doc.splitTextToSize(textContent, pageWidth);
        
        const pageHeight = doc.internal.pageSize.height;
        
        for (let i = 0; i < contentLines.length; i++) {
          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(contentLines[i], margin, y);
          y += 6; // line height
        }
        
        doc.save(`${safeTitle}.pdf`);
        setIsDownloadMenuOpen(false);
        return;
    }

    let fileContent = "";
    let mimeType = "";
    let extension = "";

    switch (format) {
      case 'md':
        extension = 'md';
        mimeType = 'text/markdown';
        fileContent = `# ${title}\n\n${textContent}`;
        break;
      case 'html':
        extension = 'html';
        mimeType = 'text/html';
        fileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #333; }
  h1 { color: #2d475c; border-bottom: 2px solid #92C973; padding-bottom: 10px; }
  ul, ol { padding-left: 20px; }
  li { margin-bottom: 5px; }
</style>
</head>
<body>
<h1>${title}</h1>
<div>${htmlContent}</div>
<p style="margin-top: 40px; font-size: 0.8em; color: #666; text-align: center;">Generated by FCS Doc Fetch</p>
</body>
</html>`;
        break;
      case 'rtf':
        extension = 'rtf';
        mimeType = 'application/rtf';
        let rtfText = textContent
            .replace(/\\/g, '\\\\')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/\n/g, '\\par\n');
        fileContent = `{\\rtf1\\ansi\\deff0\\nouicompat{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}{\\f1\\fnil\\fcharset0 Calibri;}}
{\\*\\generator FCS Doc Fetch;}\\viewkind4\\uc1 
\\pard\\sa200\\sl276\\slmult1\\f0\\fs24\\lang9 ${rtfText}\\par
}`;
        break;
      case 'txt':
      default:
        extension = 'txt';
        mimeType = 'text/plain';
        fileContent = textContent;
        break;
    }

    const element = document.createElement("a");
    const file = new Blob([fileContent], {type: mimeType});
    element.href = URL.createObjectURL(file);
    element.download = `${safeTitle}_draft.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsDownloadMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-gray-100">
      {/* Top Header */}
      <div className={`bg-white border-b border-gray-200 px-6 py-4 flex justify-between shadow-sm z-10 transition-all duration-300 ${isPromptExpanded ? 'items-start' : 'items-center'}`}>
        <div className="flex-1 min-w-0 mr-6">
          <div 
            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            className="group cursor-pointer"
            title={isPromptExpanded ? "Click to collapse" : "Click to view full prompt"}
          >
            <div className="flex items-center mb-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {isPromptExpanded ? 'Full Prompt' : 'Draft Generated From'}
              </p>
              <svg 
                className={`w-4 h-4 text-gray-400 ml-1.5 transform transition-transform duration-200 ${isPromptExpanded ? 'rotate-180' : ''} group-hover:text-fcs-green`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <h2 
              className={`text-lg font-semibold text-navy-900 group-hover:text-fcs-green-600 transition-colors ${
                isPromptExpanded 
                  ? 'whitespace-pre-wrap break-words leading-snug' 
                  : 'truncate'
              }`}
            >
              {title}
            </h2>
          </div>
        </div>
        
        <div className={`flex space-x-2 flex-shrink-0 relative ${isPromptExpanded ? 'mt-1' : ''}`}>
          
          {/* Download Dropdown */}
          <div className="relative" ref={downloadMenuRef}>
            <Button 
              variant="secondary" 
              onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)} 
              className="text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Download As...</span>
              <span className="sm:hidden">Save</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            {isDownloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 z-50">
                <button onClick={() => downloadFile('txt')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-fcs-green-700">Plain Text (.txt)</button>
                <button onClick={() => downloadFile('md')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-fcs-green-700">Markdown (.md)</button>
                <button onClick={() => downloadFile('html')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-fcs-green-700">HTML Document (.html)</button>
                <button onClick={() => downloadFile('rtf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-fcs-green-700">Rich Text (.rtf)</button>
                <button onClick={() => downloadFile('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-fcs-green-700 border-t border-gray-100">PDF Document (.pdf)</button>
              </div>
            )}
          </div>

          <Button onClick={handleCopy} className="min-w-[100px]">
             {copied ? (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 Copied
               </>
             ) : (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
                 Copy
               </>
             )}
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-gray-100 flex flex-col items-center">
        
        {/* Formatting Toolbar */}
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-t-xl border-b-0 px-4 py-2 flex items-center space-x-1 sticky top-0 z-10 shadow-sm">
            <ToolbarButton onClick={() => execCmd('bold')} title="Bold" icon={<span className="font-bold font-serif text-lg leading-none">B</span>} />
            <ToolbarButton onClick={() => execCmd('italic')} title="Italic" icon={<span className="italic font-serif text-lg leading-none">I</span>} />
            <ToolbarButton onClick={() => execCmd('underline')} title="Underline" icon={<span className="underline font-serif text-lg leading-none">U</span>} />
            <div className="h-5 w-px bg-gray-300 mx-2"></div>
            <ToolbarButton onClick={() => execCmd('insertUnorderedList')} title="Bullet List" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /><circle cx="2" cy="6" r="1" fill="currentColor"/><circle cx="2" cy="12" r="1" fill="currentColor"/><circle cx="2" cy="18" r="1" fill="currentColor"/></svg>
            } />
            <ToolbarButton onClick={() => execCmd('insertOrderedList')} title="Numbered List" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h12M9 12h12M9 18h12M5 6v12" /></svg>
            } />
            <div className="h-5 w-px bg-gray-300 mx-2"></div>
            <ToolbarButton onClick={() => execCmd('formatBlock', 'H1')} title="Heading 1" icon={<span className="font-bold text-xs">H1</span>} />
            <ToolbarButton onClick={() => execCmd('formatBlock', 'H2')} title="Heading 2" icon={<span className="font-bold text-xs">H2</span>} />
            <ToolbarButton onClick={() => execCmd('formatBlock', 'P')} title="Paragraph" icon={<span className="text-xs font-serif">¶</span>} />
        </div>

        {/* Content Editable Area */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-b-xl overflow-hidden min-h-[800px] border border-gray-100 flex flex-col">
            {/* Top decorative bar with FCS Green */}
            <div className="w-full h-1 bg-fcs-green"></div>
            
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="w-full flex-1 p-12 text-gray-800 font-serif leading-relaxed text-lg outline-none overflow-y-auto prose prose-navy max-w-none focus:bg-gray-50/30 transition-colors"
              style={{ minHeight: '800px' }}
            />
        </div>
        
        <div className="max-w-4xl mx-auto mt-4 text-center text-gray-400 text-sm pb-8">
            --- End of Draft ---
        </div>
      </div>
    </div>
  );
};

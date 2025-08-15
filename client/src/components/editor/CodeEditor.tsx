import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Save, X, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CodeEditorProps {
  onClose: () => void;
  visible: boolean;
}

export function CodeEditor({ onClose, visible }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [language, setLanguage] = useState("javascript");
  const [filename, setFilename] = useState("untitled.js");
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!visible || !editorRef.current) return;

    // Load Monaco Editor
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
    script.onload = () => {
      (window as any).require.config({ 
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
      });
      
      (window as any).require(['vs/editor/editor.main'], () => {
        if (editorRef.current && !(window as any).monaco.editor.getModels().length) {
          const monacoEditor = (window as any).monaco.editor.create(editorRef.current, {
            value: '// Welcome to the Code Editor!\n// Start typing your code here...\n\nfunction hello() {\n    console.log("Hello, World!");\n}\n\nhello();',
            language: 'javascript',
            theme: 'vs-dark',
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true
          });

          // Update cursor position
          monacoEditor.onDidChangeCursorPosition((e: any) => {
            setCursorPosition({
              line: e.position.lineNumber,
              column: e.position.column
            });
          });

          // Update word count
          monacoEditor.onDidChangeModelContent(() => {
            const content = monacoEditor.getValue();
            const words = content.trim() ? content.trim().split(/\s+/).length : 0;
            setWordCount(words);
          });

          setEditor(monacoEditor);
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [visible]);

  useEffect(() => {
    if (editor && language) {
      (window as any).monaco.editor.setModelLanguage(editor.getModel(), language);
      
      // Update filename based on language
      const extensions: Record<string, string> = {
        javascript: 'js',
        typescript: 'ts',
        python: 'py',
        html: 'html',
        css: 'css',
        json: 'json',
        markdown: 'md',
        plaintext: 'txt'
      };
      
      const ext = extensions[language] || 'txt';
      setFilename(`untitled.${ext}`);
    }
  }, [editor, language]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleRunCode = () => {
    if (!editor) return;
    
    const code = editor.getValue();
    console.log('Running code:', code);
    // TODO: Implement code execution
  };

  const handleFormatCode = () => {
    if (!editor) return;
    
    editor.getAction('editor.action.formatDocument').run();
  };

  const handleSaveFile = () => {
    if (!editor) return;
    
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!visible) return null;

  return (
    <div className="w-1/2 bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* Editor Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white flex items-center" data-testid="text-editor-title">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Code Editor
          </h3>
          
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36 bg-slate-700 border-slate-600 text-white" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="plaintext">Plain Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunCode}
            className="text-green-400 hover:text-green-300 p-2 rounded-lg hover:bg-slate-700 transition-colors"
            title="Run Code"
            data-testid="button-run-code"
          >
            <Play className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleFormatCode}
            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-slate-700 transition-colors"
            title="Format Code"
            data-testid="button-format-code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleSaveFile}
            className="text-purple-400 hover:text-purple-300 p-2 rounded-lg hover:bg-slate-700 transition-colors"
            title="Save File"
            data-testid="button-save-file"
          >
            <Save className="h-4 w-4" />
          </button>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 lg:hidden transition-colors"
            title="Close Editor"
            data-testid="button-close-editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-750">
        <div className="flex space-x-1 p-2">
          <div className="flex items-center bg-slate-700 px-3 py-2 rounded-t-lg text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-white" data-testid="text-editor-filename">{filename}</span>
            <button className="ml-2 text-slate-400 hover:text-red-400 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </div>
          <button className="text-slate-400 hover:text-white px-3 py-2 rounded-t-lg text-sm transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div 
        ref={editorRef} 
        className="flex-1 min-h-0" 
        data-testid="container-monaco-editor"
      />

      {/* Editor Footer */}
      <div className="p-3 bg-slate-750 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span data-testid="text-cursor-position">
            Line <span className="font-medium">{cursorPosition.line}</span>, Column <span className="font-medium">{cursorPosition.column}</span>
          </span>
          <span data-testid="text-word-count">{wordCount} words</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span className="capitalize" data-testid="text-editor-language">{language}</span>
        </div>
      </div>
    </div>
  );
}

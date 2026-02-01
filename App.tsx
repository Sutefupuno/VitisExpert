
import React, { useState, useEffect } from 'react';
import { API_KEY } from "./services/api";
import Header from './components/Header';
import PruningAssistant from './components/PruningAssistant';
import PhenologyGuide from './components/PhenologyGuide';
import ImageEditor from './components/ImageEditor';

// Erforderliche Typen für das window-Objekt in dieser Umgebung
// Wir augmentieren das globale AIStudio Interface, um Konflikte mit bestehenden Deklarationen zu vermeiden.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Die Deklaration muss mit der bereits vorhandenen globalen Definition übereinstimmen.
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pruning' | 'guide' | 'editor'>('pruning');
  const [needsKey, setNeedsKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  useEffect(() => {
    const checkApiKey = async () => {
      // Wenn bereits ein Key in der Umgebungsvariable ist, können wir fortfahren
      if (process.env.API_KEY && process.env.API_KEY !== "") {
        setNeedsKey(false);
        setIsCheckingKey(false);
        return;
      }

      // Prüfen, ob der Nutzer bereits über den Dialog einen Key ausgewählt hat
      try {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setNeedsKey(!hasKey);
        } else {
          // Falls wir nicht in der AI Studio Umgebung sind und kein Key da ist
          setNeedsKey(true);
        }
      } catch (e) {
        setNeedsKey(true);
      } finally {
        setIsCheckingKey(false);
      }
    };

    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // Nach dem Öffnen nehmen wir an, dass der Prozess gestartet wurde (Vermeidung von Race Conditions)
      setNeedsKey(false);
    } else {
      alert("API-Key Auswahl ist in dieser Umgebung nicht verfügbar. Bitte setzen Sie process.env.API_KEY.");
    }
  };

  if (isCheckingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (needsKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-gray-900 mb-4">API-Key erforderlich</h1>
          <p className="text-gray-600 mb-8">
            Um VitisExpert nutzen zu können, müssen Sie einen gültigen Gemini API-Key aus einem bezahlten Google Cloud Projekt auswählen.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all mb-4"
          >
            API-Key auswählen
          </button>
          <p className="text-xs text-gray-400">
            Weitere Informationen zur Abrechnung finden Sie unter <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline" rel="noreferrer">ai.google.dev/gemini-api/docs/billing</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => setActiveTab('pruning')}
            className={`px-5 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
              activeTab === 'pruning' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            Schnitt-Assistent
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`px-5 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
              activeTab === 'guide' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            Phänologie-Guide
          </button>
          <button 
            onClick={() => setActiveTab('editor')}
            className={`px-5 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
              activeTab === 'editor' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            Foto-Optimierung
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 md:p-10">
            {activeTab === 'pruning' && <PruningAssistant />}
            {activeTab === 'guide' && <PhenologyGuide />}
            {activeTab === 'editor' && <ImageEditor />}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} VitisExpert - Fachlicher Beistand im Weinberg
      </footer>
    </div>
  );
};

export default App;

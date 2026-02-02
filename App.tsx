
import React, { useState } from 'react';
import Header from './components/Header';
import PruningAssistant from './components/PruningAssistant';
import PhenologyGuide from './components/PhenologyGuide';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pruning' | 'guide' | 'editor'>('pruning');

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

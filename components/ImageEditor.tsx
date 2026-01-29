
import React, { useState, useRef } from 'react';
import { editVineyardImage } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    try {
      const result = await editVineyardImage(image, prompt);
      if (result) {
        setEditedImage(result);
      } else {
        alert("Bild konnte nicht bearbeitet werden.");
      }
    } catch (err) {
      console.error(err);
      alert("Fehler bei der Bildbearbeitung.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Füge einen Retro-Filter hinzu",
    "Entferne störende Personen im Hintergrund",
    "Mache die Farben im Laub satter",
    "Optimiere die Schärfe der Trauben",
    "Verwandle das Foto in eine Bleistiftzeichnung"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif text-gray-900 mb-2 text-center md:text-left">Foto-Optimierung</h2>
        <p className="text-gray-500 text-center md:text-left">Nutze Gemini 2.5 Flash Image, um deine Weinberg-Fotos per Texteingabe zu bearbeiten.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt="Original" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 mb-4">Lade ein Foto deines Weinbergs hoch</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Datei wählen
                </button>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {image && (
              <button 
                onClick={() => { setImage(null); setEditedImage(null); }}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">Was soll geändert werden?</label>
            <textarea 
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]"
              placeholder="z.B. 'Füge einen herbstlichen Filter hinzu' oder 'Entferne den Zaun'..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => setPrompt(s)}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <button 
              disabled={!image || !prompt || loading}
              onClick={handleEdit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Wird bearbeitet...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Bild jetzt anpassen
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
            {editedImage ? (
              <img src={editedImage} alt="Bearbeitet" className="w-full h-full object-cover animate-in fade-in duration-700" />
            ) : (
              <div className="text-center p-6 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11l-8.485 8.485a4.95 4.95 0 01-7.071-7.071L12 3.929l8.485 8.485a4.95 4.95 0 010 7.071" />
                </svg>
                <p className="text-sm">Hier erscheint dein bearbeitetes Foto</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-emerald-700 font-bold text-sm">KI rechnet...</span>
                </div>
              </div>
            )}
          </div>
          {editedImage && (
            <a 
              href={editedImage} 
              download="weinberg-optimiert.png"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl text-center block transition-all"
            >
              Foto speichern
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;

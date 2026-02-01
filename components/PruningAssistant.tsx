
import React, { useState } from 'react';
import { PruningInput, PruningRecommendation } from '../types';
import { getPruningAdvice } from '../services/geminiService';
import { fetchWeatherForPruning } from '../services/weatherService';

const PruningAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PruningRecommendation | null>(null);
  const [formData, setFormData] = useState<PruningInput>({
    variety: '',
    region: '',
    altitude: '',
    trainingSystem: 'Spalier',
    phenology: 'BBCH 00: Winterruhe',
    tempTrend: 'Mild',
    frostRisk: 'Gering',
    goal: 'Maximale Weinqualität',
    precipitation: '',
    windSpeed: ''
  });

  const handleAutoWeather = async () => {
    setWeatherLoading(true);
    try {
      const data = await fetchWeatherForPruning();
      setFormData(prev => ({
        ...prev,
        region: data.region,
        tempTrend: data.tempTrend,
        frostRisk: data.frostRisk,
        precipitation: data.precipitation,
        windSpeed: data.windSpeed
      }));
    } catch (err: any) {
      alert(err.message || "Wetterdaten konnten nicht automatisch geladen werden.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getPruningAdvice(formData);
      setRecommendation(result);
    } catch (err: any) {
      console.error(err);
      // Wenn der API-Key ungültig ist oder aus einem unbezahlten Projekt stammt
      if (err.message?.includes("Requested entity was not found")) {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
        }
      } else {
        alert("Ein Fehler ist aufgetreten.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('jetzt')) return 'bg-green-100 text-green-800 border-green-200';
    if (verdict.includes('warten')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Schnitt-Assistent</h2>
          <p className="text-gray-500">Analysiere den optimalen Zeitpunkt für deinen Rebschnitt basierend auf Phänologie und Wetter.</p>
        </div>
        <button
          type="button"
          onClick={handleAutoWeather}
          disabled={weatherLoading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors text-sm font-semibold"
        >
          {weatherLoading ? (
            <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          Wetter & Standort automatisch
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rebsorte</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none" 
              placeholder="z.B. Riesling, Spätburgunder..."
              value={formData.variety}
              onChange={e => setFormData({...formData, variety: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Region</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Region"
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Höhenlage (m)</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="z.B. 300m"
                value={formData.altitude}
                onChange={e => setFormData({...formData, altitude: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Niederschlag</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="z.B. 0.5 mm"
                value={formData.precipitation}
                onChange={e => setFormData({...formData, precipitation: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Wind</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="z.B. 15 km/h"
                value={formData.windSpeed}
                onChange={e => setFormData({...formData, windSpeed: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Erziehungsform</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.trainingSystem}
              onChange={e => setFormData({...formData, trainingSystem: e.target.value})}
            >
              <option>Spalier (Guyot)</option>
              <option>Zapfenschnitt (Kordon)</option>
              <option>Umkehr-Erziehung</option>
              <option>Pfahlerziehung</option>
              <option>Hausrebe (Pergola)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phänologisches Stadium</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.phenology}
              onChange={e => setFormData({...formData, phenology: e.target.value})}
            >
              <option value="BBCH 00: Winterruhe">BBCH 00: Winterruhe</option>
              <option value="BBCH 01: Beginn des Saftflusses (Bluten)">BBCH 01: Beginn des Saftflusses (Bluten)</option>
              <option value="BBCH 03: Knospenschwellen">BBCH 03: Knospenschwellen</option>
              <option value="BBCH 05: Wollestadium">BBCH 05: Wollestadium</option>
              <option value="BBCH 07: Beginn des Aufbruchs (Grünspitzen)">BBCH 07: Beginn des Aufbruchs (Grünspitzen)</option>
              <option value="BBCH 09: Blattaustrieb">BBCH 09: Blattaustrieb</option>
              <option value="BBCH 53+: Nach Austrieb (Wachstum/Blüte)">BBCH 53+: Nach Austrieb (Wachstum/Blüte)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Temperaturtrend</label>
              <select 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.tempTrend}
                onChange={e => setFormData({...formData, tempTrend: e.target.value})}
              >
                <option value="Ansteigend">Ansteigend</option>
                <option value="Stabil (mild)">Stabil (mild)</option>
                <option value="Stabil (frostig)">Stabil (frostig)</option>
                <option value="Sinkend">Sinkend</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Frostrisiko</label>
              <select 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.frostRisk}
                onChange={e => setFormData({...formData, frostRisk: e.target.value})}
              >
                <option value="Gering">Gering</option>
                <option value="Mittel">Mittel</option>
                <option value="Hoch (Spätfrostgefahr)">Hoch (Spätfrostgefahr)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Winzer-Ziel</label>
            <select 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
            >
              <option value="Maximale Weinqualität">Maximale Weinqualität</option>
              <option value="Hoher Ertrag">Hoher Ertrag</option>
              <option value="Rebenvitalität & Langlebigkeit">Rebenvitalität & Langlebigkeit</option>
              <option value="Minimale Arbeitszeit">Minimale Arbeitszeit</option>
              <option value="Verjüngung der Rebe">Verjüngung der Rebe</option>
              <option value="Sanfter Rebschnitt (Simonit & Sirch)">Sanfter Rebschnitt (Simonit & Sirch)</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyse läuft...
              </>
            ) : (
              'Empfehlung einholen'
            )}
          </button>
        </div>
      </form>

      {recommendation && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center ${getVerdictColor(recommendation.verdict)}`}>
            <span className="uppercase text-xs font-bold tracking-widest mb-2 opacity-70">Empfehlung</span>
            <h3 className="text-4xl font-serif italic">„{recommendation.verdict}“</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fachliche Begründung
              </h4>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
                {recommendation.justification}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Typische Fehler
                </h4>
                <ul className="space-y-2">
                  {recommendation.commonMistakes.map((error, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>

              {recommendation.alternativeStrategy && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-800 mb-1">Alternative Strategie</h4>
                  <p className="text-sm text-blue-700 leading-snug">{recommendation.alternativeStrategy}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PruningAssistant;

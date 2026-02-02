
import React, { useState } from 'react';

interface ChartPoint {
  bbch: string;
  label: string;
  suitability: number; // 0 to 100
  risk: string;
  color: string;
}

const chartData: ChartPoint[] = [
  { bbch: '00', label: 'Winterruhe', suitability: 95, risk: 'Minimal', color: '#059669' },
  { bbch: '01', label: 'Saftfluss', suitability: 85, risk: 'Gering', color: '#10b981' },
  { bbch: '03', label: 'Schwellen', suitability: 60, risk: 'Mittel (Bruchgefahr)', color: '#f59e0b' },
  { bbch: '05', label: 'Wolle', suitability: 75, risk: 'Mittel (Frostschutz-Strategie)', color: '#3b82f6' },
  { bbch: '07', label: 'Aufbruch', suitability: 20, risk: 'Hoch (Vitalitätsverlust)', color: '#ef4444' },
  { bbch: '09', label: 'Austrieb', suitability: 5, risk: 'Kritisch', color: '#b91c1c' },
];

const PruningWindowChart: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  const width = 800;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getX = (index: number) => padding + (index * (chartWidth / (chartData.length - 1)));
  const getY = (suitability: number) => height - padding - (suitability * (chartHeight / 100));

  // Generate SVG Path
  const linePath = chartData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.suitability)}`).join(' ');
  
  // Area Path
  const areaPath = `${linePath} L ${getX(chartData.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-serif text-gray-900">Schnittfenster-Visualisierung</h3>
          <p className="text-sm text-gray-500">Eignung des Rebschnitts im Verhältnis zum BBCH-Stadium</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Optimal</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Strategisch</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Riskant</div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto pb-4">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="min-w-[600px] w-full h-auto overflow-visible"
        >
          {/* Background Grids */}
          {[0, 25, 50, 75, 100].map(v => (
            <line 
              key={v}
              x1={padding} y1={getY(v)} x2={width - padding} y2={getY(v)} 
              stroke="#f1f5f9" strokeWidth="1" 
            />
          ))}

          {/* Area under curve */}
          <path d={areaPath} fill="url(#suitabilityGradient)" opacity="0.1" />
          
          <defs>
            <linearGradient id="suitabilityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="3" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
          />

          {/* Points */}
          {chartData.map((point, i) => (
            <g 
              key={point.bbch} 
              onMouseEnter={() => setHoveredPoint(point)} 
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <circle 
                cx={getX(i)} 
                cy={getY(point.suitability)} 
                r={hoveredPoint?.bbch === point.bbch ? "8" : "5"} 
                fill={point.color} 
                className="transition-all duration-200"
              />
              <text 
                x={getX(i)} 
                y={height - padding + 20} 
                textAnchor="middle" 
                className="text-[10px] font-bold fill-gray-400 uppercase tracking-tighter"
              >
                BBCH {point.bbch}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div 
            className="absolute top-0 right-0 bg-gray-900 text-white p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-150 z-10 max-w-[200px]"
          >
            <div className="text-[10px] font-bold text-emerald-400 mb-1 uppercase tracking-widest">BBCH {hoveredPoint.bbch}</div>
            <div className="font-bold text-sm mb-1">{hoveredPoint.label}</div>
            <div className="text-xs text-gray-400 mb-2">Risiko: <span className="text-white">{hoveredPoint.risk}</span></div>
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${hoveredPoint.suitability}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 border-t border-gray-50 pt-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Ideales Fenster</span>
          <p className="text-sm font-medium text-gray-700">BBCH 00 - 01</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Strategischer Spätschnitt</span>
          <p className="text-sm font-medium text-gray-700">BBCH 05 (Wolle)</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Schnittstopp</span>
          <p className="text-sm font-medium text-red-600">Ab BBCH 07 (Grünspitzen)</p>
        </div>
      </div>
    </div>
  );
};

export default PruningWindowChart;

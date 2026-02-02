
import React, { useState } from 'react';
import PruningWindowChart from './PruningWindowChart';

interface Stage {
  bbch: string;
  name: string;
  summary: string;
  description: string;
  vitisExpertTip: string;
  visualMarkers: string[];
  riskFactor: 'Niedrig' | 'Mittel' | 'Hoch';
}

const stages: Stage[] = [
  {
    bbch: '00',
    name: 'Winterruhe',
    summary: 'Tiefe Keimruhe ohne sichtbares Wachstum.',
    description: 'Die Rebe befindet sich in der tiefen Keimruhe. Es findet kein sichtbares Wachstum statt. Die Knospen sind fest geschlossen und von braunen Schuppen bedeckt. In diesem Stadium ist die Frosthärte am höchsten.',
    vitisExpertTip: 'Ideale Zeit für den Hauptschnitt bei frostunempfindlichen Sorten und in Lagen ohne extremes Spätfrostrisiko. Achten Sie auf saubere Schnitte nahe am Auge.',
    visualMarkers: ['Braune, glatte Knospenschuppen', 'Kein Saftfluss an Schnittwunden', 'Holz ist trocken und hart'],
    riskFactor: 'Niedrig'
  },
  {
    bbch: '01',
    name: 'Beginn des Saftflusses (Bluten)',
    summary: 'Wurzelaktivität beginnt, Wasser steigt auf.',
    description: 'Mit steigenden Bodentemperaturen beginnt die Wurzelaktivität. Wasser und Nährstoffe werden in die Ruten gepumpt. An frischen Schnittstellen tritt Flüssigkeit (Rebtränen) aus.',
    vitisExpertTip: 'Das "Bluten" ist physiologisch unbedenklich, signalisiert aber das Ende der tiefen Ruhe. Ein Schnitt ist weiterhin möglich.',
    visualMarkers: ['Wassertropfen an Schnittflächen', 'Knospen wirken leicht "lebendiger"', 'Rinde lässt sich schwerer lösen'],
    riskFactor: 'Niedrig'
  },
  {
    bbch: '03',
    name: 'Knospenschwellen',
    summary: 'Knospen vergrößern sich deutlich.',
    description: 'Die Knospen vergrößern sich deutlich und strecken sich. Die Schuppen beginnen sich zu spreizen, und das hellere "Wollfutter" wird im Inneren sichtbar.',
    vitisExpertTip: 'Vorsicht: Die Knospen werden jetzt extrem empfindlich gegen Berührung. Vermeiden Sie mechanische Belastungen beim Biegen der Ruten.',
    visualMarkers: ['Deutliche Volumenvergrößerung', 'Helles Gewebe unter Schuppen sichtbar', 'Knospen fühlen sich weicher an'],
    riskFactor: 'Mittel'
  },
  {
    bbch: '05',
    name: 'Wollestadium',
    summary: 'Knospe ist in schützende Wolle gehüllt.',
    description: 'Die Knospe ist fast vollständig von brauner oder weißlicher Wolle (den Haaren der Knospenschuppen) umhüllt. Die Schuppen sind weit offen.',
    vitisExpertTip: 'Ein später Schnitt in diesem Stadium kann den Austrieb um einige Tage verzögern – eine wertvolle Strategie gegen Mai-Fröste.',
    visualMarkers: ['Dichter Haarfilz sichtbar', 'Braune Schuppen kaum noch erkennbar', 'Kein Grün sichtbar'],
    riskFactor: 'Mittel'
  },
  {
    bbch: '07',
    name: 'Beginn des Aufbruchs (Grünspitzen)',
    summary: 'Erstes lebendiges Grün bricht durch.',
    description: 'Die ersten grünen Blattspitzen durchbrechen das Wollstadium. Das Stadium ist erreicht, wenn das erste Grün deutlich sichtbar wird.',
    vitisExpertTip: 'Schnittarbeiten sollten jetzt zwingend abgeschlossen sein. Die Rebe verbraucht nun aktiv Reservestoffe aus dem Altholz.',
    visualMarkers: ['Erstes lebendiges Grün sichtbar', 'Blattanlagen noch eng gefaltet', 'Wolle wird zur Seite geschoben'],
    riskFactor: 'Hoch'
  },
  {
    bbch: '09',
    name: 'Blattaustrieb',
    summary: 'Blätter entfalten sich, Triebspitze sichtbar.',
    description: 'Die ersten Blätter entfalten sich und spreizen sich vom Trieb ab. Die Triebspitze wird sichtbar. Das Längenwachstum beginnt.',
    vitisExpertTip: 'Der Vegetationszyklus ist in vollem Gange. Achten Sie auf erste Anzeichen von Oidium oder Peronospora bei entsprechender Witterung.',
    visualMarkers: ['Blätter flach ausgebreitet', 'Sichtbare Triebachse', 'Wachstum ist täglich messbar'],
    riskFactor: 'Hoch'
  },
  {
    bbch: '53',
    name: 'Gescheine sichtbar',
    summary: 'Erste Blütenstände erscheinen am Trieb.',
    description: 'Die Blütenstände (Gescheine) werden an den jungen Trieben sichtbar. Sie sind zunächst noch klein, knubbelig und eng beisammen stehend.',
    vitisExpertTip: 'Beginnen Sie jetzt mit der gezielten Beobachtung auf Schädlinge. Eine lockere Laubwand fördert das Abtrocknen der Gescheine und beugt Krankheiten vor.',
    visualMarkers: ['Kleine "Traubenminiaturen" sichtbar', 'Einzelne Blütenknospen noch fest geschlossen', 'Trieblänge meist 10-20 cm'],
    riskFactor: 'Mittel'
  },
  {
    bbch: '65',
    name: 'Vollblüte',
    summary: 'Entscheidende Phase für die Befruchtung.',
    description: 'Etwa 50% der Blütenkäppchen sind abgefallen. Die Rebe blüht. Dies ist eine sehr sensible Phase, die trockenes, warmes Wetter für einen guten Fruchtansatz erfordert.',
    vitisExpertTip: 'Ruhe im Weinberg! Vermeiden Sie Stressfaktoren wie intensive Bodenbearbeitung oder starke Spritzungen, um das Risiko des Verrieselns (Abstoßen der Blüten) zu senken.',
    visualMarkers: ['Sichtbare Staubgefäße', 'Abgefallene Blütenkäppchen am Boden', 'Charakteristischer, feiner Blütenduft'],
    riskFactor: 'Hoch'
  },
  {
    bbch: '75',
    name: 'Beerenwachstum (Erbsengröße)',
    summary: 'Rasche Entwicklung der Fruchtkörper.',
    description: 'Die Beeren haben etwa Erbsengröße erreicht. Die Trauben beginnen durch ihr Eigengewicht nach unten zu hängen. Das Traubengerüst festigt sich.',
    vitisExpertTip: 'Ideal für die Entblätterung der Traubenzone bei moderater Witterung, um die Beerenhaut abzuhärten und Pilzbefall (Botrytis) im Herbst vorzubeugen.',
    visualMarkers: ['Beeren ca. 7-10mm Durchmesser', 'Traubengerüst wird stabiler', 'Zunahme des Gewichts deutlich erkennbar'],
    riskFactor: 'Mittel'
  },
  {
    bbch: '81',
    name: 'Reifebeginn (Véraison)',
    summary: 'Farbumschlag und Weichwerden der Beeren.',
    description: 'Die Einlagerung von Zucker beginnt massiv. Rotweinsorten verfärben sich von Grün nach Blau/Violett, Weißweinsorten werden gelblich oder durchscheinend.',
    vitisExpertTip: 'Zeit für die "Grüne Lese" (Ertragsregulierung), falls nötig. Entfernen Sie unreife oder zu dichte Trauben, um die Qualität der verbleibenden Früchte zu steigern.',
    visualMarkers: ['Farbumschlag der Beerenhüllen', 'Beeren geben auf Druck leicht nach', 'Erste Zunahme der Süße beim Probieren'],
    riskFactor: 'Mittel'
  },
  {
    bbch: '89',
    name: 'Vollreife',
    summary: 'Ernteoptimum ist erreicht.',
    description: 'Die Beeren haben ihr sortentypisches Aroma und das gewünschte Zucker-Säure-Verhältnis erreicht. Die Kerne sind braun und schmecken nussig.',
    vitisExpertTip: 'Messen Sie regelmäßig das Mostgewicht (Oechsle) und probieren Sie die Beeren. Die physiologische Reife der Kerne ist oft wichtiger als der reine Zuckergehalt.',
    visualMarkers: ['Sortentypische Ausfärbung vollendet', 'Braune, feste Traubenkerne', 'Beeren lassen sich leicht vom Stielgerüst lösen'],
    riskFactor: 'Niedrig'
  }
];

const PhenologyGuide: React.FC = () => {
  const [expandedBbch, setExpandedBbch] = useState<string | null>(null);

  const toggleStage = (bbch: string) => {
    setExpandedBbch(expandedBbch === bbch ? null : bbch);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Hoch': return 'bg-red-100 text-red-700 border-red-200';
      case 'Mittel': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-grow">
          <h2 className="text-3xl font-serif text-gray-900 mb-2">Phänologie-Guide</h2>
          <p className="text-gray-500 max-w-2xl">Bestimme das aktuelle Entwicklungsstadium deiner Reben präzise nach der BBCH-Skala.</p>
        </div>
        <div className="flex gap-2">
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-md border border-gray-200 uppercase tracking-tighter whitespace-nowrap">BBCH Skala 00-89</span>
        </div>
      </div>

      <PruningWindowChart />

      <div className="grid grid-cols-1 gap-4">
        {stages.map((stage) => {
          const isExpanded = expandedBbch === stage.bbch;
          return (
            <div 
              key={stage.bbch} 
              onClick={() => toggleStage(stage.bbch)}
              className={`group cursor-pointer bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                isExpanded 
                  ? 'border-emerald-300 shadow-lg ring-1 ring-emerald-50' 
                  : 'border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100'
              }`}
            >
              <div className="p-5 flex items-center gap-5">
                <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl font-bold text-xl border transition-colors ${
                  isExpanded ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {stage.bbch}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-emerald-800' : 'text-gray-900'}`}>
                      {stage.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(stage.riskFactor)}`}>
                        Risiko: {stage.riskFactor}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-500' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {!isExpanded && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{stage.summary}</p>
                  )}
                </div>
              </div>

              <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-5 pb-6 border-t border-gray-50 pt-5 space-y-6">
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Beschreibung</h4>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{stage.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Erkennungsmerkmale</h4>
                      <ul className="space-y-2">
                        {stage.visualMarkers.map((marker, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                            <span className="flex-shrink-0 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            {marker}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-emerald-600 rounded-xl p-5 text-white shadow-inner">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        VitisExpert Tipp
                      </h4>
                      <p className="text-sm leading-relaxed italic">"{stage.vitisExpertTip}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4 items-start shadow-sm">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-blue-900 text-lg">Phänologische Schnittverzögerung</h4>
          <p className="text-sm text-blue-800 leading-relaxed">
            Ein gezielter Schnitt im <strong>Wollestadium (BBCH 05)</strong> kann den Austrieb um bis zu 10 Tage verzögern. Dies ist besonders in Regionen mit hoher Spätfrostgefahr (Eisheilige) eine effektive Versicherung für den Ertrag. Der "Blutverlust" (Stadium 01) schwächt die Rebe hingegen kaum, schützt aber vor dem Austrocknen der Schnittwunden durch den Frost.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhenologyGuide;

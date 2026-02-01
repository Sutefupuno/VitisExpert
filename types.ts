
export interface PruningInput {
  variety: string;
  region: string;
  altitude: string;
  trainingSystem: string;
  phenology: string;
  tempTrend: string;
  frostRisk: string;
  goal: string;
  precipitation?: string;
  windSpeed?: string;
}

export interface PruningRecommendation {
  verdict: 'jetzt schneiden' | 'noch warten' | 'nur vorbereitende Arbeiten';
  justification: string;
  commonMistakes: string[];
  alternativeStrategy?: string;
}

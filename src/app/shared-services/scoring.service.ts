import { Injectable } from '@angular/core';
import { IScoring } from '../classes/iscoring';
import { IGameData } from '../classes/igame-data';

@Injectable()
export class ScoringService {

  /**
   * Function that calculates the score for a single game based on the provided scoring rules
   * @param scoringRules The rules containing the scoring amounts
   * @param gameData The single game data stats to be calculated
   */
  GetScore(scoringRules: IScoring, gameData: IGameData): number {
    console.log('GetScore called');
    const score = (scoringRules.PaInt * gameData.PaInt) +
      (scoringRules.PaTD * gameData.PaTd) +
      (scoringRules.PaYa / scoringRules.PaYaInterval * gameData.PaYd) +
      (scoringRules.RuTD * gameData.RuTd) +
      (scoringRules.RuYa / scoringRules.RuYaInterval * gameData.RuYds);

    return score;
  }

  GetAllScores(scoringRules: IScoring, allGameData: IGameData[]): number[] {
    let allScores: number[] = [];
    for (let i = 0; i < allGameData.length; i++) {
      allScores.push(this.GetScore(scoringRules, allGameData[i]));
    }
    return allScores;
  }

  GetAllScoresFromDatum(allDatum: Plotly.Datum[] | Plotly.Datum[][] | Plotly.TypedArray): number[]{
    let allScores: number[] = [];
    for (let i = 0; i < allDatum.length; i++) {
      allScores.push(parseInt(allDatum[i].valueOf().toString()));
    }
    return allScores;
  }
}

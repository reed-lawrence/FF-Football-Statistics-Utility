import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerDataService } from './services/player-data.service';
import { IPlayer } from '../classes/iplayer';
import { ScoringService } from '../shared-services/scoring.service';
import { IScoring } from '../classes/iscoring';
import * as Plotly from 'plotly.js';
import { IColorPair } from '../classes/icolor-pair';
import { ColorService } from '../shared-services/color.service';
import { MathService } from '../shared-services/math.service';
import { IGameData } from '../classes/igame-data';

@Component({
  selector: 'app-player-data',
  templateUrl: './player-data.component.html',
  styleUrls: ['./player-data.component.css']
})
export class PlayerDataComponent implements OnInit {

  constructor(
    private _playerDataService: PlayerDataService,
    private _scoringService: ScoringService,
    private _colorService: ColorService,
    private _mathService: MathService
  ) { }

  // Players and filtered player arrays
  allPlayers: IPlayer[];
  allPlayersPosFiltered: IPlayer[];
  allPlayersNameFiltered: IPlayer[];
  selectedPlayers: IPlayer[] = [];

  chosenPosition = 'All';
  chosenSort = 'none';
  scoringRules: IScoring = {
    PaYa: 1,
    PaYaInterval: 25,
    PaInt: -2,
    PaTD: 4,
    RuYa: 1,
    RuYaInterval: 10,
    RuTD: 6,
    ReYa: 1,
    ReYaInterval: 10,
    ReTD: 6
  }

  scoringRulesEdit: IScoring;

  boxPlots: Plotly.Data[] = [];

  @ViewChild('boxOutput') boxOutputEle: ElementRef;
  @ViewChild('playerSearchInput') playerSearchInputEle: ElementRef;
  @ViewChild('scoringModal') scoringModalEle: ElementRef;


  /**
   * Sets the component level postition filter label and initiates 
   * the PerformPositionFilter function
   * @param newPosition The new position to be set
   */
  SetChosenPosition(newPosition: string) {
    this.chosenPosition = newPosition;
    this.PerformPositionFilter(this.chosenPosition);
  }

  /**
   * Function to search the master list of all players loaded and filter by position
   * @param newPosition The new position to filter all players by
   */
  PerformPositionFilter(newPosition: string) {
    if (newPosition === 'All') {
      this.allPlayersPosFiltered = this.allPlayers.slice();
    } else {
      this.allPlayersPosFiltered = this.allPlayers.filter((p: IPlayer) => p.Position.indexOf(newPosition) !== -1);
    }
    this.ResetNameFilter();
    console.log(this.allPlayersPosFiltered);
  }

  /**
   * Function to search the current list of position-filtered players
   * @param newNameFilter The filterby criteria to search names by
   */
  PerformNameFilter(newNameFilter: string) {
    this.allPlayersNameFiltered = this.allPlayersPosFiltered.filter(
      (p: IPlayer) => p.Name.toLowerCase().indexOf(newNameFilter.toLowerCase()) !== -1);
  }

  DropdownTypeOpenFix(inputEle: any) {
    const dropdownEle = $(inputEle).closest('.dropdown');
    if (!$(dropdownEle).hasClass('show')) {
      $(inputEle).dropdown('toggle');
    }
  }

  /**
   * Function to reset the name filter, usually this will only get called when 
   * initializing the filter, or setting the position filter to something new
   */
  ResetNameFilter() {
    this.PerformNameFilter('');
  }

  /**
   * Async function to get all players from the player service 
   * and assign it to the component scoped allPlayers: IPlayer[]
   */
  GetAllPlayers() {
    this._playerDataService.getAllPlayers().subscribe(
      response => {
        this.allPlayers = response;
        this.PerformPositionFilter('All');
        this.PerformNameFilter('');
      },
      error => {
        console.log('Error getting all players');
      }
    )
  }

  /**
   * Async function to get the game data for a single player. Callback will trigger AddPlayerPlot to 
   * add calculate the player score and redraw the plot.
   * @param player Player object to be passed in
   * @param scoringRule Scoring rules to calculate the points a player earned in each game
   */
  GetPlayerData(player: IPlayer, scoringRule: IScoring) {
    console.log('GetPlayerData called');
    this._playerDataService.getPlayerDataById(player.Id).subscribe(
      response => {
        // Find the index of the selected played corresponding to the id passed in
        const playerIndex = this.selectedPlayers.findIndex(p => p.Id === player.Id);

        // Set the GameData of the respective player equal to the response.
        this.selectedPlayers[playerIndex].GameData = response;

        // Add the player plot
        this.AddPlayerPlot(player, scoringRule);
      },
      error => {
        console.log('Error getting data for player');
      }
    )
  }

  /**
   * Function to add a single player to the component selectedPlayerList
   * @param player Player object to be passed in
   */
  AddPlayer(player: IPlayer) {

    // Ensure the player has not already been added
    const playerIndex = this.selectedPlayers.findIndex(p => p.Id === player.Id);
    if (playerIndex === -1) {

      // Add the player to the list of selected players
      this.selectedPlayers.push(player);

      // Call the async function to get the player game data, passing in the component scoring rules
      this.GetPlayerData(player, this.scoringRules);

      // Reset the search bar and name search
      $(this.playerSearchInputEle.nativeElement).val('');
      this.PerformNameFilter('');
    }
  }

  /**
   * Function that removes a player from the selected players array 
   * and triggers the RemovePlot() function
   * @param player Player to remove
   */
  RemovePlayer(player: IPlayer) {

    // Find the index of the player in the selected players array
    const playerIndex = this.selectedPlayers.findIndex(p => p.Id === player.Id);

    // Splice the player at that index
    this.selectedPlayers.splice(playerIndex, 1);

    // Remove the plot
    this.RemovePlot(player);
  }

  /**
   * Function that removes a plot from the box plots array 
   * and triggers a re-draw of the plots
   * @param player Player to remove
   */
  RemovePlot(player: IPlayer) {

    // Find the index of the player in the box plots array
    const plotIndex = this.boxPlots.findIndex(p => p.playerId === player.Id);

    // Splice the plot at that index
    this.boxPlots.splice(plotIndex, 1);

    // Redraw the plots
    this.DrawPlot(this.boxPlots);
  }

  /**
   * Function to add the data of a single player to the component box plots.
   * Will trigger a redraw of the plots. 
   * @param newPlayer Player object to be passed in
   * @param scoringRule Scoring rules to calculate the points a player earned in each game
   */
  AddPlayerPlot(newPlayer: IPlayer, scoringRule: IScoring) {

    // Get the scores for each game the player has logged
    let scores: number[] = [];
    for (let i = 0; i < newPlayer.GameData.length; i++) {
      const gameScore = this._scoringService.GetScore(scoringRule, newPlayer.GameData[i]);
      scores.push(gameScore);
    }

    const colors: IColorPair = this._colorService.GetColors(newPlayer.Team);
    // Create the new trace plot
    const trace: Plotly.Data = {
      y: scores,
      type: 'box',
      name: newPlayer.Name,
      playerId: newPlayer.Id,
      boxpoints: 'all',
      jitter: 0,
      pointpos: 0,
      boxmean: true,
      marker: {
        color: colors.Border
      },
      fillcolor: colors.Fill
    }

    // Push the new players data plot to the array of box plots
    this.boxPlots.push(trace);

    // Redraw the plots
    this.DrawPlot(this.boxPlots);

    switch (this.chosenSort) {
      case 'none':
        this.DrawPlot(this.boxPlots);
        break;
      case 'ceiling':
        this.SortPlotsByCeiling();
        break;
      case 'floor':
        this.SortPlotsByFloor();
        break;
      case 'mean':
        this.SortPlotsByMean();
        break;
      case 'median':
        this.SortPlotsByMedian();
        break;
      case 'total':
        this.SortPlotsByTotal();
        break;
    }
  }


  /**
   * Function to sort the plots by their medians and redraw the plot
   */
  SortPlotsByMedian() {
    this.boxPlots.sort((a, b) => {
      const aAllScores = this._scoringService.GetAllScoresFromDatum(a.y);
      const bAllScores = this._scoringService.GetAllScoresFromDatum(b.y);

      const aMedian = this._mathService.GetMedian(aAllScores);
      const bMedian = this._mathService.GetMedian(bAllScores);

      return aMedian > bMedian ? -1 : aMedian < bMedian ? 1 : 0
    });

    // Set the component-level chosen sort value
    this.chosenSort = 'median';

    // Redraw the plots
    this.DrawPlot(this.boxPlots);
  }

  /**
   * Function to sort the plots by their means and redraw the plot
   */
  SortPlotsByMean() {
    this.boxPlots.sort((a, b) => {
      const aAllScores = this._scoringService.GetAllScoresFromDatum(a.y);
      const bAllScores = this._scoringService.GetAllScoresFromDatum(b.y);

      const aMean = this._mathService.GetMean(aAllScores);
      const bMean = this._mathService.GetMean(bAllScores);

      return aMean > bMean ? -1 : aMean < bMean ? 1 : 0
    });

    // Set the component-level chosen sort value
    this.chosenSort = 'mean';

    // Redraw the plots
    this.DrawPlot(this.boxPlots);
  }

  /**
   * Function to sort the plots by their 3rd quartiles and redraw the plot
   */
  SortPlotsByCeiling() {
    this.boxPlots.sort((a, b) => {
      const aAllScores = this._scoringService.GetAllScoresFromDatum(a.y);
      const bAllScores = this._scoringService.GetAllScoresFromDatum(b.y);

      const aCeiling = this._mathService.GetQuartile(aAllScores, 0.75);
      const bCeiling = this._mathService.GetQuartile(bAllScores, 0.75);

      return aCeiling > bCeiling ? -1 : aCeiling < bCeiling ? 1 : 0
    });

    // Set the component-level chosen sort value
    this.chosenSort = 'ceiling';

    // Redraw the plots
    this.DrawPlot(this.boxPlots);
  }

  /**
   * Function to sort the plots by their 2nd quartiles and redraw the plot
   */
  SortPlotsByFloor() {
    this.boxPlots.sort((a, b) => {
      const aAllScores = this._scoringService.GetAllScoresFromDatum(a.y);
      const bAllScores = this._scoringService.GetAllScoresFromDatum(b.y);

      const aFloor = this._mathService.GetQuartile(aAllScores, 0.25);
      const bFloor = this._mathService.GetQuartile(bAllScores, 0.25);

      return aFloor > bFloor ? -1 : aFloor < bFloor ? 1 : 0
    });

    // Set the component-level chosen sort value
    this.chosenSort = 'floor';

    // Redraw the plots
    this.DrawPlot(this.boxPlots);
  }

  SortPlotsByTotal() {
    this.boxPlots.sort((a, b) => {
      const aAllScores = this._scoringService.GetAllScoresFromDatum(a.y);
      const bAllScores = this._scoringService.GetAllScoresFromDatum(b.y);

      const aSum = this._mathService.GetSum(aAllScores);
      const bSum = this._mathService.GetSum(bAllScores);

      return aSum > bSum ? -1 : aSum < bSum ? 1 : 0
    });

    // Set the component-level chosen sort value
    this.chosenSort = 'total';

    // Redraw the plots
    this.DrawPlot(this.boxPlots);
  }

  /**
   * Function to initiate a redraw of the box plots
   * @param plotData Array of Plotly Data types
   */
  DrawPlot(plotData: Plotly.Data[]) {

    // Get the max for each player
    let plotMaxDatas: number[] = []
    for (let i = 0; i < plotData.length; i++) {
      plotMaxDatas.push(this._mathService.GetMaxFromDatum(plotData[i].y));
    }

    // Get the total max point val for all plots 
    const maxPointVal = this._mathService.GetMax(plotMaxDatas) + 5;

    // Set the layout of the plot
    let layout = {
      xaxis: {
        showticklabels: false
      },
      yaxis: {
        range: [0, maxPointVal]
      },
      autosize: true,
      margin: {
        l: 30,
        r: 20,
        b: 30,
        t: 30,
        pad: 4
      },
      showlegend: false
    };

    let config: Partial<Plotly.Config> = {
      displayModeBar: false
    }
    Plotly.newPlot(this.boxOutputEle.nativeElement, plotData, layout, config);
  }

  /**
   * Function to toggle the scoring edit modal
   */
  ToggleScoringModal() {
    $(this.scoringModalEle.nativeElement).modal('toggle');
  }

  /**
   * Function that 
   * @param newScoringRules new scoring rules to be assigned to the component-level scoring rules
   */
  SaveScoringRules(newScoringRules: IScoring) {
    console.log('SaveScoringRules called');

    // Set the new scoring rules - quick and efficient breaking of potential object references
    this.scoringRules = JSON.parse(JSON.stringify(newScoringRules));

    // Reset the box plots
    this.boxPlots = [];

    // Re-add all of the players to the boxplots
    for (let i = 0; i < this.selectedPlayers.length; i++) {
      this.AddPlayerPlot(this.selectedPlayers[i], this.scoringRules);
    }

    this.ToggleScoringModal();
  }



  ngOnInit() {
    this.GetAllPlayers();
    this.DrawPlot(this.boxPlots);
    this.scoringRulesEdit = this.scoringRules;
  }

}

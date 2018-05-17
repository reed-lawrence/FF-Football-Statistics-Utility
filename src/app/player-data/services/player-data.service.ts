import { Injectable } from '@angular/core'; 
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable'; 
import { IPlayer } from '../../classes/iplayer'; 
import { IGameData } from '../../classes/igame-data';

@Injectable()
export class PlayerDataService {

  constructor(private http: HttpClient) { }

  private getAllPlayersUrl = './api/players/GetAllPlayers.php';
  private getPlayerDataByIdUrl = './api/players/GetPlayerDataById.php?id={id}';


  /**
   * Function to get all of the players. 
   * Returns an Observable of type IPlayer[]
   */
  getAllPlayers(): Observable<IPlayer[]>{
    return this.http.get<IPlayer[]>(this.getAllPlayersUrl);
  }

  /**
   * Function to get all of the player game log data for a single player.
   * Returns an observable of type IGameData[]
   * @param id The id of the desired player 
   */
  getPlayerDataById(id: number): Observable<IGameData[]> { 
    return this.http.get<IGameData[]>(this.getPlayerDataByIdUrl.replace('{id}', id.toString()))
  }
}

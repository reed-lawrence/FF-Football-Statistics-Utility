import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { PlayerDataComponent } from './player-data/player-data.component';
import { PlayerDataService } from './player-data/services/player-data.service';
import * as $ from 'jquery'; 
import * as bootstrap from 'bootstrap';
import * as Plotly from 'plotly.js';
import { ScoringService } from './shared-services/scoring.service';
import { ColorService } from './shared-services/color.service';
import { MathService } from './shared-services/math.service';



@NgModule({
  declarations: [
    AppComponent,
    PlayerDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    PlayerDataService,
    ScoringService,
    ColorService,
    MathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

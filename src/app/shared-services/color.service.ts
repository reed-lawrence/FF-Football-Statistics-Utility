import { Injectable } from '@angular/core';
import { IColorPair } from '../classes/icolor-pair';

@Injectable()
export class ColorService {

  constructor() { }

  GetColors(team: string): IColorPair {
    switch (team) {
      case 'ARI':
        return {
          Border: '#c1133d',
          Fill: '#FFB612'
        };
      case 'ATL':
        return {
          Border: '#000000',
          Fill: '#A71930'
        };
      case 'WSH':
        return {
          Border: '#FFB612',
          Fill: '#773141'
        };
      case 'PHI':
        return {
          Border: '#A5ACAF',
          Fill: '#004953'
        };
      case 'NYG':
        return {
          Border: '#A71930',
          Fill: '#0B2265'
        };
      case 'DAL':
        return {
          Border: '#869397',
          Fill: '#041E42'
        };
      case 'LAC':
        return {
          Border: '#FFB612',
          Fill: '#0073CF'
        };
      case 'OAK':
        return {
          Border: '#A5ACAF',
          Fill: '#000000'
        };
      case 'KC':
        return {
          Border: '#FFB81C',
          Fill: '#C8102E'
        };
      case 'DEN':
        return {
          Border: '#0C2340',
          Fill: '#FC4C02'
        };
      case 'TEN':
        return {
          Border: '#4B92DB',
          Fill: '#002244'
        };
      case 'JAX':
        return {
          Border: '#D29F13',
          Fill: '#006272'
        };
      case 'IND':
        return {
          Border: '#A2AAAD',
          Fill: '#003A70'
        };
      case 'HOU':
        return {
          Border: '#A71930',
          Fill: '#03202F'
        };
      case 'PIT':
        return {
          Border: '#101820',
          Fill: '#FFB81C'
        };
      case 'CLE':
        return {
          Border: '#311D00',
          Fill: '#EC5614'
        };
      case 'CIN':
        return {
          Border: '#000000',
          Fill: '#FB4F14'
        };
      case 'BAL':
        return {
          Border: '#9E7C0C',
          Fill: '#241773'
        };
      case 'NYJ':
        return {
          Border: '#FFFFFF',
          Fill: '#203731'
        };
      case 'NE':
        return {
          Border: '#C60C30',
          Fill: '#002244'
        };
      case 'MIA':
        return {
          Border: '#FC4C02',
          Fill: '#008E97'
        };
      case 'BUF':
        return {
          Border: '#C60C30',
          Fill: '#00338D'
        };
      case 'SEA':
        return {
          Border: '#69BE28',
          Fill: '#002244'
        };
      case 'SF':
        return {
          Border: '#85714D',
          Fill: '#A6192E'
        };
      case 'LAR':
        return {
          Border: '#866D4B',
          Fill: '#041E42'
        };
      case 'TB':
        return {
          Border: '#3D3935',
          Fill: '#C8102E'
        };
      case 'NO':
        return {
          Border: '#101820',
          Fill: '#D3BC8D'
        };
      case 'CAR':
        return {
          Border: '#101820',
          Fill: '#0085CA'
        };
      case 'MIN':
        return {
          Border: '#FFC62F',
          Fill: '#4F2683'
        };
      case 'GB':
        return {
          Border: '#FFB81C',
          Fill: '#183028'
        };
      case 'DET':
        return {
          Border: '#B0B7BC',
          Fill: '#005A8B'
        };
      case 'CHI':
        return {
          Border: '#C83803',
          Fill: '#0B162A'
        };
    }
  }
}

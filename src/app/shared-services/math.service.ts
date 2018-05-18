import { Injectable } from '@angular/core';

@Injectable()
export class MathService {

  constructor() { }

  GetMax(array: number[]): number {
    return Math.max.apply(null, array);
  }

  GetMaxFromDatum(allDatum: Plotly.Datum[] | Plotly.Datum[][] | Plotly.TypedArray): number {
    let allNumbers: number[] = [];
    for (let i = 0; i < allDatum.length; i++) {
      allNumbers.push(parseInt(allDatum[i].valueOf().toString()));
    }
    return Math.max.apply(null, allNumbers);
  }

  GetMin(array: number[]): number {
    return Math.min.apply(null, array);
  }

  GetRange(array: number[]): number {
    return Math.max.apply(null, array) - Math.min.apply(null, array);
  }

  GetMidRange(array: number[]): number {
    return this.GetRange(array) / 2;
  }

  GetSum(array: number[]): number {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum;
  }

  GetMean(array: number[]): number {
    return this.GetSum(array) / array.length;
  }

  GetMedian(array: number[]): number {
    array.sort(function (a, b) {
      return a - b;
    });
    var mid = array.length / 2;
    return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
  }

  GetVariance(array: number[]): number {
    const mean = this.GetMean(array);
    return this.GetMean(array.map(function (num) {
      return Math.pow(num - mean, 2);
    }));
  }

  GetStdDev(array: number[]): number {
    return Math.sqrt(this.GetVariance(array));
  }

  GetMeanAbsDev(array: number[]): number {
    const mean = this.GetMean(array);
    return this.GetMean(array.map(function (num) {
      return Math.abs(num - mean);
    }));
  }

  GetZScores(array: number[]): number[] {
    const mean = this.GetMean(array);
    const stdDev = this.GetStdDev(array);
    return array.map(function (num) {
      return (num = mean) / stdDev;
    });
  }

  // Ported from PHP from: https://blog.poettner.de/2011/06/09/simple-statistics-with-php/
  GetQuartile(array: number[], quartile: number): number {
    array.sort((a, b) => a - b);
    const pos = ((array.length) - 1) * quartile;
    const base = Math.floor(pos);
    const rest = pos - base;
    if ((array[base + 1] !== null && array[base + 1] !== undefined)) {
      return array[base] + rest * (array[base + 1] - array[base]);
    } else {
      return array[base];
    }
  }

}

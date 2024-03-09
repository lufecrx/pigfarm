import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute

import { RestService } from 'src/app/services/rest/rest.service';
import { IPig } from 'src/app/model/pig/pig.interface';
import {
  BubbleDataPoint,
  ChartData,
  ChartTypeRegistry,
  ScatterDataPoint,
} from 'chart.js';

interface IPigWeightEntry {
  date: string;
  weight: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data:
    | ChartData<
        keyof ChartTypeRegistry,
        (number | ScatterDataPoint | BubbleDataPoint | null)[],
        unknown
      >
    | undefined;
  constructor(
    private activatedRoute: ActivatedRoute,
    private restService: RestService
  ) {}

  public pig!: IPig;

  ngOnInit(): void {
    const pigId = this.activatedRoute.snapshot.queryParams['pigRef'];

    if (pigId) {
      this.loadPigAndInitChart(pigId);
    }
  }

  loadPigAndInitChart(pigId: string): void {
    this.restService.getItem(pigId).subscribe((pig: IPig) => {
      console.log('Pig:', pig);
      console.log('Weight history:', pig.weightHistory); // Verifique se o weightHistory está definido e não é undefined
      this.pig = pig;
      this.initChartForSinglePig(pig.weightHistory);
    });
  }

  initChartForSinglePig(
    weightHistory: { date: string; weight: string }[]
  ): void {
    // Convertendo weightHistory em um array usando Object.values()
    const weightHistoryArray = Object.values(weightHistory);
    console.log(weightHistoryArray);

    const combinedDatesAndWeights = weightHistoryArray.map((entry) => ({
      date: entry.date,
      weight: parseFloat(entry.weight),
    }));

    combinedDatesAndWeights.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    })

    // Extrair as datas e os pesos do histórico
    const dates = combinedDatesAndWeights.map((entry) => entry.date);
    const weights = combinedDatesAndWeights.map((entry) => entry.weight);

    console.log('dates:', dates);
    console.log('weights:', weights);

    this.data = {
      labels: dates,
      datasets: [
        {
          label: 'Peso',
          backgroundColor: 'rgba(220, 220, 220, 0.2)',
          borderColor: 'rgba(220, 220, 220, 1)',
          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
          pointBorderColor: '#fff',
          data: weights,
        },
      ],
    };
  }
}

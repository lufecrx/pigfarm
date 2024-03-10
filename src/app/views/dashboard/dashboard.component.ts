import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importe ActivatedRoute

import { RestService } from 'src/app/services/rest/rest.service';
import { IPig } from 'src/app/model/pig/pig.interface';
import {
  BubbleDataPoint,
  ChartData,
  ChartTypeRegistry,
  ScatterDataPoint,
} from 'chart.js';

import {
  FormatDatePipe,
} from 'src/app/services/pipes/format-date.pipe';

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
    private restService: RestService,
    private formatDate: FormatDatePipe,
    private router: Router,
  ) {}

  pigSelected!: IPig;
  pigRef: string = '';
  avatar: string = './assets/img/avatars/pig.png';

  ngOnInit(): void {
    const pigRef = this.activatedRoute.snapshot.queryParams['pigRef'];

    if (pigRef) {
      this.pigRef = pigRef;
      this.loadPigAndInitChart(pigRef);
    }
  }

  loadPigAndInitChart(pigRef: string): void {
    this.restService.getItem(pigRef).subscribe((pig: IPig) => {
      this.pigSelected = pig;
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
    let dates = combinedDatesAndWeights.map((entry) => entry.date);
    let weights = combinedDatesAndWeights.map((entry) => entry.weight);

    dates = dates.map((date) => this.formatDate.transform(date));

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

  weightControl(): void {
    this.router.navigate(['manager/weight-control'], {
      queryParams: { pigRef: this.pigRef },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

interface IPigWeightEntry {
  date: string;
  weight: number;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private chartsData: DashboardChartsData) {
  }

  public pigWeightHistory: IPigWeightEntry[] = []; // Assuming you have the pig weight history data

  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    // Assuming you fetch pig weight history data from a service
    // and it's stored in this.pigWeightHistory
    this.initCharts();
  }
  initCharts(): void {
    // Assuming this.pigWeightHistory contains the pig's weight history
    this.chartsData.initMainChart(this.pigWeightHistory);
    this.mainChart = this.chartsData.mainChart;
  }
}

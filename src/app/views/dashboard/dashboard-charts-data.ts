import { Injectable } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {}

  public mainChart: IChartProps = {};

  initMainChart(weightHistory: { date: string, weight: number }[]) {
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(brandInfo, 10);
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    this.mainChart['elements'] = weightHistory.length;
    this.mainChart['Data1'] = weightHistory.map(entry => entry.weight);

    const labels = weightHistory.map(entry => entry.date);

    const colors = [
      {
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff'
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];

    const datasets = [
      {
        data: this.mainChart['Data1'],
        label: 'Peso',
        ...colors[0]
      }
    ];

    const options = {
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          beginAtZero: true,
          // You can set appropriate max and ticks here
        }
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }
}

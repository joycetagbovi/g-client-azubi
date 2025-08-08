import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  imports: [CommonModule]
})
export class ChartComponent implements OnChanges {
  @Input() data: ChartData[] = [];
  @Input() type: ChartType = 'bar';
  @Input() options: any = {};
  
  @ViewChild('chartCanvas', { static: true }) 
  chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart = signal<Chart | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length > 0) {
      this.createChart();
    }
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const existingChart = this.chart();
    if (existingChart) {
      existingChart.destroy();
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#1D4ED8'); // Dark blue at top
    gradient.addColorStop(0.5, '#3B82F6'); // Medium blue in middle
    gradient.addColorStop(1, '#93C5FD');

    const config: ChartConfiguration = {
      type: this.type,
      data: {
        labels: this.data.map(item => item.label),
        datasets: [{
          label: 'Revenue',
          data: this.data.map(item => item.value),
          backgroundColor: gradient,
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 6,
            callbacks: {
              label: (context: any) => {
                const value = context.parsed.y;
                if (value >= 1000) {
                  return `Revenue: ${(value / 1000).toFixed(1)}k`;
                }
                return `Revenue: ${value}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
             border: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12,
                weight: '500'
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            border: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              },
              callback: function(value: any) {
                if (value >= 1000) {
                  return (value / 1000) + 'k';
                }
                return value;
              }
            }
          }
        },
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 10,
            left: 10
          }
        },
        ...this.options
      }
    };

    const newChart = new Chart(ctx, config);
    this.chart.set(newChart);
  }
}

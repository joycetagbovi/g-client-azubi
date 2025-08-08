import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from '../../components/navbar/navbar';
import { TrackCard } from '../../components/track-card/track-card';
import { InvoiceService} from '../../../../core/services/invoice.service';
import {TrackService} from  '../../../../core/services/track.service';
import { LearnerService } from '../../../../core/services/learner.service';
import { ChartComponent } from '../../../../shared/components/chart/chart'
import {firstValueFrom} from 'rxjs';
import { Track ,Invoice, AllLearner} from '../../../../shared/models/models'
interface DashboardStats {
  totalLearners: number;
  totalRevenue: number;
  totalInvoices: number;
  revenueGrowth: number;
  learnerGrowth: number;
  invoiceGrowth: number;
}
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    Navbar, 
    TrackCard, 
    FontAwesomeModule,
  ChartComponent 
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  dashboardStats = signal<DashboardStats | null>(null);
  tracks = signal<Track[]>([]);
  latestInvoices = signal<Invoice[]>([]);
  revenueData = signal<any[]>([]); 
  isLoading = signal(true);

  getGrowthIcon = (growth: number) => (growth >= 0 ? this.faArrowUp : this.faArrowDown);

  getGrowthClass = (growth: number) => (growth >= 0 ? 'text-custom-success' : 'text-red-500');

  formatGrowth = (growth: number) => (growth > 0 ? `+${growth}%` : `${growth}%`);;
  
  statsError = signal<string | null>(null);
  tracksError = signal<string | null>(null);
  invoicesError = signal<string | null>(null);
  revenueError = signal<string | null>(null);

  constructor(
    private invoiceService: InvoiceService,
    private trackService: TrackService,
    private learnerService: LearnerService
  ) {}
  
async ngOnInit() {
    await this.loadDashboardData();
    console.log('latest',  this.latestInvoices)
  }

private async loadDashboardData() {
    this.isLoading.set(true);
    try {
      const [invoices, tracks, learners] = await Promise.all([
        firstValueFrom(this.invoiceService.getInvoices()),
        firstValueFrom(this.trackService.getTracks()),
        firstValueFrom(this.learnerService.getLearners())
      ]);
      // Calculate total revenue from invoices
      const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
      // Set the dashboard stats using the counts
      this.dashboardStats.set({
        totalLearners: learners.length,
        totalRevenue: totalRevenue,
        totalInvoices: invoices.length,
        revenueGrowth: 15, 
        learnerGrowth: 15, 
        invoiceGrowth: 15, 
      });
      // Set the tracks and latest invoices
      this.tracks.set(tracks);
      this.latestInvoices.set(invoices);
      const monthlyRevenue = this.getMonthlyRevenue(invoices);
      this.revenueData.set(monthlyRevenue);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private getMonthlyRevenue(invoices: Invoice[]): { label: string, value: number }[] {
    const revenueByMonth: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.dueDate);
      const month = monthNames[date.getMonth()];
      revenueByMonth[month] = (revenueByMonth[month] || 0) + invoice.amount;
    });

    return monthNames
      .filter(month => revenueByMonth[month] !== undefined)
      .map(month => ({
        label: month,
        value: revenueByMonth[month]
      }));
}

}

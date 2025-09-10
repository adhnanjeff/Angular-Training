import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { BugService, BugStats } from "./services/bug.service";

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ChartModule
    ],
    templateUrl: './admin-dashboard.component.html',
    styles: [``]
})

export class AdminDashboardComponent implements OnInit {
    Stats?: BugStats;
    // Chart
    openResolvedData: any;
    bugsByProjectData: any;
    bugsByStatusData: any;
    constructor(private bugService: BugService) { }

    ngOnInit(): void {
        console.log('Admin Dashboard initializing...');
        this.bugService.getBugStats().subscribe({
            next: (stats: BugStats) => {
                console.log('Bug stats loaded:', stats);
                this.Stats = stats;
                this.setupCharts(stats);
            },
            error: (error) => {
                console.error('Error loading bug stats, using mock data:', error);
                this.loadMockData();
            }
        });
    }

    private setupCharts(stats: BugStats): void {
        this.openResolvedData = {
            labels: ['Open', 'Resolved'],
            datasets: [{
                data: [stats.openVsResolved.open, stats.openVsResolved.resolved],
                backgroundColor: ["#42A5F5", "#66BB6A"],
                hoverBackgroundColor: ["#64B5F6", "#81C784"]
            }]
        };

        this.bugsByProjectData = {
            labels: Object.keys(stats.bugsByProject),
            datasets: [{
                data: Object.values(stats.bugsByProject),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }]
        };

        this.bugsByStatusData = {
            labels: Object.keys(stats.bugsByStatus),
            datasets: [{
                label: 'Bugs by Status',
                data: Object.values(stats.bugsByStatus),
                backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56", "#9966FF"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0", "#FFCE56", "#9966FF"]
            }]
        };
    }

    private loadMockData(): void {
        console.log('Loading mock data for admin dashboard');
        const mockStats: BugStats = {
            openVsResolved: { open: 15, resolved: 25 },
            bugsByProject: { 'Project A': 12, 'Project B': 18, 'Project C': 10 },
            bugsByStatus: { 'Open': 15, 'In Progress': 8, 'Resolved': 25, 'Closed': 12 }
        };
        this.Stats = mockStats;
        this.setupCharts(mockStats);
        console.log('Mock data loaded, Stats:', this.Stats);
    }

    get Object() {
        return Object;
    }
}
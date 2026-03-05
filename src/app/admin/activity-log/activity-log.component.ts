import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { ActivityLog } from '@app/_models/activity-log.model';

@Component({
    selector: 'app-activity-log',
    templateUrl: './activity-log.component.html',
    styleUrls: [] // Adding ad-hoc styling in the HTML for better control of glassmorphic look
})
export class ActivityLogComponent implements OnInit {
    logs: ActivityLog[] = [];
    filteredLogs: ActivityLog[] = [];
    userSummaries: any[] = [];
    loading = false;
    searchText = '';
    expandedLogId: number | null = null;

    constructor(private accountService: AccountService) { }

    ngOnInit(): void {
        this.loadLogs();
    }

    toggleDetails(id: number) {
        this.expandedLogId = this.expandedLogId === id ? null : id;
    }

    loadLogs() {
        this.loading = true;

        // Load full logs
        this.accountService.getAllActivityLogs().subscribe({
            next: (logs) => {
                this.logs = logs;
                this.filterLogs();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading logs:', err);
                this.loading = false;
            }
        });

        // Load summary
        this.accountService.getLatestUserActivities().subscribe({
            next: (summaries) => {
                this.userSummaries = summaries;
            },
            error: (err) => console.error('Error loading summaries:', err)
        });
    }

    filterLogs() {
        if (!this.searchText) {
            this.filteredLogs = this.logs;
            return;
        }

        const search = this.searchText.toLowerCase();
        this.filteredLogs = this.logs.filter(log =>
            log.userName.toLowerCase().includes(search) ||
            log.userEmail.toLowerCase().includes(search) ||
            log.actionType.toLowerCase().includes(search) ||
            log.actionDetails.toLowerCase().includes(search)
        );
    }
}

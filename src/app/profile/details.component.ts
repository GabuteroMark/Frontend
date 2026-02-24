import { Component, OnInit } from '@angular/core';
import { AccountService, GradeLevelService } from '@app/_services';
import { GradeLevel } from '@app/_models';
import { ActivityLog } from '@app/_models/activity-log.model';


@Component({
    templateUrl: 'details.component.html'
})
export class DetailsComponent implements OnInit {
    account = this.accountService.accountValue;
    activityLogs: ActivityLog[] = [];
    filteredLogs: ActivityLog[] = [];
    allActivityLogs: ActivityLog[] = [];
    filteredAllLogs: ActivityLog[] = [];
    GradeLevel: GradeLevel | null = null;
    gradeLevel!: GradeLevel; // ✅ keep this for actual usage
    showActivityLogs = false;
    showAllActivityLogs = false;
    showBranchInfo: boolean = false;
    searchTerm: string = '';
    startDate: string = '';
    endDate: string = '';
    adminSearchTerm: string = '';
    adminStartDate: string = '';
    adminEndDate: string = '';

    constructor(
        private accountService: AccountService,
        private gradeLevelService: GradeLevelService

    ) {}

    ngOnInit(): void {
        if (this.account?.id) {
            this.getActivityLogs(this.account.id);

            if (this.account.BranchId) {
                // ✅ Convert to number if backend expects number
                const branchIdNum = Number(this.account.BranchId);
                this.getBranchById(branchIdNum);
            }
        }
    }
    getBranchById(branchIdNum: number) {
        throw new Error('Method not implemented.');
    }

    getActivityLogs(accountId: string): void {
        this.accountService.getActivityLogs(accountId).subscribe({
            next: (logs: ActivityLog[]) => {
                this.activityLogs = logs;
                this.filteredLogs = logs;
            },
            error: (error: any) => {
                console.error('Error fetching activity logs:', error);
            }
        });
    }

    handleSearch(): void {
        const startTime = this.startDate ? new Date(this.startDate).getTime() : null;
        const endTime = this.endDate ? new Date(this.endDate).getTime() : null;

        this.filteredLogs = this.activityLogs.filter((log: ActivityLog) => {
            const logTime = new Date(log.timestamp).getTime();
            const matchesTerm = log.actionType.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesStart = !startTime || logTime >= startTime;
            const matchesEnd = !endTime || logTime <= endTime;
            return matchesTerm && matchesStart && matchesEnd;
        });
    }

    getAllActivityLogs(): void {
        this.accountService.getAllActivityLogs().subscribe({
            next: (logs: ActivityLog[]) => {
                this.allActivityLogs = logs;
                this.filteredAllLogs = logs;
            },
            error: (error: any) => {
                console.error('Error fetching all activity logs:', error);
            }
        });
    }

    handleAdminSearch(): void {
        const startTime = this.adminStartDate ? new Date(this.adminStartDate).getTime() : null;
        const endTime = this.adminEndDate ? new Date(this.adminEndDate).getTime() : null;

        this.filteredAllLogs = this.allActivityLogs.filter((log: ActivityLog) => {
            const logTime = new Date(log.timestamp).getTime();
            const matchesTerm = log.actionType.toLowerCase().includes(this.adminSearchTerm.toLowerCase());
            const matchesStart = !startTime || logTime >= startTime;
            const matchesEnd = !endTime || logTime <= endTime;
            return matchesTerm && matchesStart && matchesEnd;
        });
    }

    // ✅ Updated method to fetch gradeLevel and handle null safely
    getGradeLevelById(id: number): void {
      this.gradeLevelService.getById(id).subscribe({
        next: (data: GradeLevel) => {
          this.gradeLevel = data;
        },
        error: (err: any) => console.error(err)
      });
    }

    toggleAllActivityLogs(): void {
        if (!this.showAllActivityLogs) {
            this.getAllActivityLogs();
        }
        this.showAllActivityLogs = !this.showAllActivityLogs;
    }

    toggleActivityLogs(): void {
        this.showActivityLogs = !this.showActivityLogs;
    }

    toggleBranchInfo(): void {
        this.showBranchInfo = !this.showBranchInfo;
    }

    isManager(): boolean {
        return this.account?.role === 'Staff';
    }

    isAdmin(): boolean {
        return this.account?.role === 'Admin';
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AIQuestionService, TopicRequest } from './ai-question.service';
import { AccountService } from '@app/_services';

@Component({
    selector: 'app-submission-history',
    templateUrl: './submission-history.component.html'
})
export class SubmissionHistoryComponent implements OnInit {
    myRequests: TopicRequest[] = [];
    loading = false;
    userRole: string = '';
    searchTerm: string = '';
    filterDate: string = '';

    get filteredRequests() {
        return this.myRequests.filter(req => {
            const searchLower = this.searchTerm.toLowerCase();
            const matchesSearch = !this.searchTerm ||
                (req.firstName?.toLowerCase().includes(searchLower)) ||
                (req.lastName?.toLowerCase().includes(searchLower)) ||
                (req.fileName?.toLowerCase().includes(searchLower)) ||
                (req.subjectName?.toLowerCase().includes(searchLower)) ||
                (req.sectionName?.toLowerCase().includes(searchLower)) ||
                (req.gradeLevelName?.toLowerCase().includes(searchLower));

            const matchesDate = !this.filterDate ||
                (new Date(req.createdAt).toDateString() === new Date(this.filterDate).toDateString());

            return matchesSearch && matchesDate;
        });
    }

    constructor(
        private aiService: AIQuestionService,
        private accountService: AccountService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadMySubmissions();
    }

    loadMySubmissions() {
        const account = this.accountService.accountValue;
        if (!account) return;

        this.userRole = account.role as string;
        this.loading = true;
        this.aiService.getTopicRequests({
            accountId: Number(account.id),
            role: account.role,
            academicLevel: account.role === 'Coordinator' ? account.assignedLevel : undefined
        })
            .subscribe({
                next: requests => {
                    this.myRequests = requests;
                    this.loading = false;
                },
                error: err => {
                    console.error(err);
                    this.loading = false;
                }
            });
    }

    viewGeneratedPDF(req: any) {
        this.router.navigate([`/grade-level/${req.gradeLevelId}/sections/${req.sectionId}/subjects`], {
            queryParams: {
                academicLevel: req.academicLevel,
                sectionName: req.sectionName,
                openPdfModal: req.subjectId
            }
        });
    }
}

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

        this.loading = true;
        this.aiService.getTopicRequests({ accountId: Number(account.id), role: account.role })
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

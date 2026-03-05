import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AIQuestionService, TopicRequest } from './ai-question.service';
import { AccountService } from '@app/_services';
import { Role } from '@app/_models';

@Component({
    selector: 'app-topic-approval',
    templateUrl: './topic-approval.component.html'
})
export class TopicApprovalComponent implements OnInit {
    requests: TopicRequest[] = [];
    loadingId: number | null = null;
    errorMsg = '';
    successMsg = '';
    searchTerm: string = '';
    filterDate: string = '';

    get filteredRequests() {
        return this.requests.filter(req => {
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
        this.laodRequests();
    }

    laodRequests() {
        const account = this.accountService.accountValue;
        if (!account) return;

        this.aiService.getTopicRequests({ role: account.role, accountId: Number(account.id) })
            .subscribe({
                next: res => this.requests = res,
                error: err => console.error(err)
            });
    }

    approve(req: TopicRequest) {
        this.loadingId = req.id;
        this.successMsg = '';
        this.errorMsg = '';

        this.aiService.approveTopic(req.id).subscribe({
            next: res => {
                this.loadingId = null;
                this.successMsg = `✅ Approved: AI is generating questions for ${req.fileName}`;
                this.laodRequests();
            },
            error: err => {
                this.loadingId = null;
                this.errorMsg = 'Failed to approve topic';
                console.error(err);
            }
        });
    }

    reject(req: TopicRequest) {
        const remarks = prompt('Enter rejection reason:');
        if (remarks === null) return;

        this.aiService.rejectTopic(req.id, remarks).subscribe({
            next: () => {
                this.successMsg = 'Topic rejected';
                this.laodRequests();
            },
            error: err => console.error(err)
        });
    }

    viewPDF(req: TopicRequest) {
        if (req.requestFileUrl) {
            window.open(`http://localhost:5000${req.requestFileUrl}`, '_blank');
        } else if (req.fileName.startsWith("Multiple Files")) {
            alert("This request contains multiple files. Please check the 'uploads' folder on the server.");
        } else {
            // Fallback for older records if any
            window.open(`http://localhost:5000/download/requests/${req.fileName.split('/').pop()}`, '_blank');
        }
    }

    viewGeneratedPDF(req: any) {
        console.log('Navigating to subject with context:', {
            gradeLevelId: req.gradeLevelId,
            sectionId: req.sectionId,
            subjectId: req.subjectId,
            academicLevel: req.academicLevel,
            sectionName: req.sectionName
        });

        this.router.navigate([`/grade-level/${req.gradeLevelId}/sections/${req.sectionId}/subjects`], {
            queryParams: {
                academicLevel: req.academicLevel,
                sectionName: req.sectionName,
                openPdfModal: req.subjectId
            }
        });
    }
}

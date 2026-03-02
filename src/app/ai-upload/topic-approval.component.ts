import { Component, OnInit } from '@angular/core';
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

    constructor(
        private aiService: AIQuestionService,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.laodRequests();
    }

    laodRequests() {
        this.aiService.getTopicRequests({ role: Role.Admin })
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
        // In a real app we'd open a viewer, for now we just link to it if we had a direct download for raw uploads
        // For now, raw uploads aren't directly served by static /download yet, but we'll assume they are accessible
        window.open(`http://localhost:5000/download/requests/${req.fileName.split('/').pop()}`, '_blank');
    }
}

import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";

import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { Bug, BugService, Comment } from "./services/bug.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-bug-detail',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        InputTextModule,

        ButtonModule,
        FormsModule,
        TagModule,
        DialogModule
    ],
    templateUrl: './bug-detail.component.html',
    styles: [``]
})
export class BugDetailComponent implements OnInit {
    @Input() bug?: Bug;
    newComment: string = '';
    showCommentsDialog = false;

    constructor(private bugService: BugService, private route: ActivatedRoute) {}

    ngOnInit() {
        if (!this.bug) {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            if (id) {
                this.bugService.getBug(id).subscribe(bug => this.bug = bug);
            }
        }
    }

    addComment() {
        if (this.newComment?.trim() && this.bug) {
            const comment: Comment = {
                author: 'Current User',
                message: this.newComment.trim(),
                createdDate: new Date()
            };
            
            this.bugService.addComment(this.bug.id!, comment).subscribe({
                next: (addedComment) => {
                    if (!this.bug?.comments) {
                        this.bug!.comments = [];
                    }
                    this.bug!.comments.push(addedComment);
                    this.newComment = '';
                },
                error: (error) => {
                    console.error('Error adding comment:', error);
                    // Fallback: add comment locally if API fails
                    if (!this.bug?.comments) {
                        this.bug!.comments = [];
                    }
                    this.bug!.comments.push({
                        ...comment,
                        id: Date.now()
                    });
                    this.newComment = '';
                }
            });
        }
    }

    getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
        switch (status?.toLowerCase()) {
            case 'resolved':
            case 'closed':
                return 'success';
            case 'in progress':
            case 'assigned':
                return 'info';
            case 'open':
            case 'new':
                return 'warning';
            default:
                return 'info';
        }
    }

    getPrioritySeverity(priority: string): 'success' | 'info' | 'warning' | 'danger' {
        switch (priority?.toLowerCase()) {
            case 'high':
            case 'critical':
                return 'danger';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'info';
        }
    }

    openCommentsDialog() {
        this.showCommentsDialog = true;
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeLevelService, AccountService } from '@app/_services';
import { GradeLevel, Account } from '@app/_models';
import { Role } from '@app/_models';

@Component({
  selector: 'app-grade-level-list',
  templateUrl: './grade-level-list.component.html'
})
export class GradeLevelListComponent implements OnInit {
  gradeLevels: GradeLevel[] = [];
  loading = false;
  academicLevel?: string;
  account?: Account | null;
  Role = Role;

  constructor(
    private gradeLevelService: GradeLevelService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.account = this.accountService.accountValue;
    const account = this.account;

    // If this is a scoped coordinator, auto-redirect to their assigned level
    if (account?.role === Role.Coordinator && account?.assignedLevel) {
      this.router.navigate(['/grade-level'], {
        queryParams: { academicLevel: account.assignedLevel },
        replaceUrl: true
      });
    }

    this.route.queryParams.subscribe(params => {
      this.academicLevel = params.academicLevel?.trim();
      if (this.academicLevel) {
        this.loadGradeLevels(this.academicLevel);
      } else {
        this.gradeLevels = [];
      }
    });
  }

  loadGradeLevels(academicLevel?: string) {
    this.loading = true;
    this.gradeLevelService.getAll(academicLevel).subscribe({
      next: (data) => {
        // Sort grade levels numerically if possible (e.g., Grade 1 before Grade 2)
        this.gradeLevels = data.sort((a, b) => {
          const numA = parseInt(a.name.replace(/^\D+/g, '')) || 0;
          const numB = parseInt(b.name.replace(/^\D+/g, '')) || 0;
          return numA - numB;
        });
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  showSubjects(id: number): void {
    this.router.navigate(['/grade-level', id, 'sections'], { queryParams: { academicLevel: this.academicLevel } });
  }
}

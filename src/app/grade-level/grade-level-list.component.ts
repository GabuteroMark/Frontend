import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeLevelService } from '@app/_services';
import { GradeLevel } from '@app/_models';

@Component({
  selector: 'app-grade-level-list',
  templateUrl: './grade-level-list.component.html'
})
export class GradeLevelListComponent implements OnInit {
  gradeLevels: GradeLevel[] = [];
  loading = false;
  constructor(
    private gradeLevelService: GradeLevelService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loadGradeLevels(params.academicLevel);
    });
  }

  loadGradeLevels(academicLevel?: string) {
    this.loading = true;
    this.gradeLevelService.getAll(academicLevel).subscribe({
      next: (data) => { this.gradeLevels = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  showSubjects(id: number): void {
    this.router.navigate(['/subjects', id]);
  }
}

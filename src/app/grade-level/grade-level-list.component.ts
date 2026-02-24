import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGradeLevels();
  }

  loadGradeLevels() {
    this.loading = true;
    this.gradeLevelService.getAll().subscribe({
      next: (data) => { this.gradeLevels = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  showSubjects(id: number): void {
    this.router.navigate(['/subjects', id]);
  }
}

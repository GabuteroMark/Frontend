import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService, Section } from '@app/_services/section.service';
import { GradeLevelService } from '@app/_services/grade-level.service';

@Component({
  selector: 'app-subjects-list',
  templateUrl: './subjects-list.component.html'
})
export class SubjectsListComponent implements OnInit {
  sections: Section[] = [];
  loading = false;
  gradeLevelId = 0;
  gradeLevelName = '';
  academicLevel = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sectionService: SectionService,
    private gradeLevelService: GradeLevelService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('gradeLevelId');
    if (!id) {
      alert('Grade Level ID missing');
      this.router.navigate(['/grade-level']);
      return;
    }
    this.gradeLevelId = Number(id);

    // Fetch parent grade level details
    this.gradeLevelService.getById(this.gradeLevelId).subscribe(res => {
      this.gradeLevelName = res.name;
    });

    this.route.queryParams.subscribe(params => {
      this.academicLevel = params.academicLevel || '';
    });

    this.loadSections();
  }

  loadSections(): void {
    this.loading = true;
    this.sectionService.getAll(this.gradeLevelId)
      .subscribe({
        next: (res) => {
          this.sections = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  addSection(): void {
    this.router.navigate([`/grade-level/${this.gradeLevelId}/sections/add`], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }

  editSection(id?: number): void {
    if (!id) return;
    this.router.navigate([`/grade-level/${this.gradeLevelId}/sections/edit/${id}`], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }

  deleteSection(id?: number): void {
    if (!id) return;
    if (!confirm('Delete section?')) return;

    this.sectionService.delete(this.gradeLevelId, id)
      .subscribe({
        next: () => this.loadSections(),
        error: err => console.error(err)
      });
  }

  viewSubjects(section: Section): void {
    this.router.navigate([`/grade-level/${this.gradeLevelId}/sections/${section.id}/subjects`], {
      queryParams: { academicLevel: this.academicLevel, sectionName: section.name }
    });
  }

  goBack(): void {
    this.router.navigate(['/grade-level'], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }
}
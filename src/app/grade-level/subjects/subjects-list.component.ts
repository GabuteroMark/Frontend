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
  selectedStrand = '';
  selectedSemester = '';
  strands = ['GAS', 'ABM', 'STEM', 'HUMMS', 'TVL'];
  yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  semesters = ['1st Semester', '2nd Semester'];

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
      this.selectedStrand = params.strand || '';
      this.selectedSemester = params.semester || '';
      this.loadSections();
    });
  }

  loadSections(): void {
    // Tertiary Flow: 
    if (this.academicLevel === 'Tertiary Education') {
      if (!this.selectedStrand) {
        this.sections = [];
        return;
      }
      if (!this.selectedSemester) {
        this.sections = [];
        return;
      }

      // Both Year Level (strand) and Semester are selected
      this.loading = true;
      this.sectionService.getAll(this.gradeLevelId, this.selectedStrand).subscribe(res => {
        const semesterSection = res.find(s => s.name === this.selectedSemester);
        if (semesterSection) {
          this.viewSubjects(semesterSection);
        } else {
          // Create the semester section if it doesn't exist
          this.sectionService.create(this.gradeLevelId, this.selectedSemester, this.selectedStrand).subscribe(newSec => {
            this.viewSubjects(newSec);
          });
        }
      });
      return;
    }

    const isSpecialized = this.gradeLevelName === 'Grade 11' ||
      this.gradeLevelName === 'Grade 12';

    if (isSpecialized && !this.selectedStrand) {
      this.sections = [];
      return;
    }

    this.loading = true;
    this.sectionService.getAll(this.gradeLevelId, this.selectedStrand)
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
      queryParams: {
        academicLevel: this.academicLevel,
        strand: this.selectedStrand
      }
    });
  }

  editSection(id?: number): void {
    if (!id) return;
    this.router.navigate([`/grade-level/${this.gradeLevelId}/sections/edit/${id}`], {
      queryParams: {
        academicLevel: this.academicLevel,
        strand: this.selectedStrand
      }
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
      queryParams: {
        academicLevel: this.academicLevel,
        sectionName: section.name,
        strand: this.selectedStrand,
        semester: this.selectedSemester
      }
    });
  }

  selectStrand(strand: string): void {
    const params: any = { strand: strand };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  selectSemester(semester: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { semester: semester },
      queryParamsHandling: 'merge'
    });
  }

  goBack(): void {
    const isSpecialized = this.gradeLevelName === 'Grade 11' ||
      this.gradeLevelName === 'Grade 12';

    if (isSpecialized && this.selectedStrand) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { strand: null },
        queryParamsHandling: 'merge'
      });
      return;
    }

    if (this.academicLevel === 'Tertiary Education') {
      if (this.selectedSemester) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { semester: null },
          queryParamsHandling: 'merge'
        });
        return;
      }
      if (this.selectedStrand) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { strand: null },
          queryParamsHandling: 'merge'
        });
        return;
      }
    }

    this.router.navigate(['/grade-level'], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }
}
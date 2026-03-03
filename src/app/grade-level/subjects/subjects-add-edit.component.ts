import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService, Section } from '@app/_services/section.service';
import { GradeLevelService } from '@app/_services/grade-level.service';

@Component({
  selector: 'app-subjects-add-edit',
  templateUrl: './subjects-add-edit.component.html'
})
export class SubjectsAddEditComponent implements OnInit {

  form!: FormGroup;
  sectionId?: number;
  gradeLevelId!: number;
  gradeLevelName = '';
  academicLevel = '';

  title = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private sectionService: SectionService,
    private gradeLevelService: GradeLevelService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    const gradeParam = this.route.snapshot.paramMap.get('gradeLevelId');
    if (!gradeParam) {
      alert('Invalid Grade Level');
      this.router.navigate(['/grade-level']);
      return;
    }

    this.gradeLevelId = Number(gradeParam);

    // Fetch parent grade level details
    this.gradeLevelService.getById(this.gradeLevelId).subscribe(res => {
      this.gradeLevelName = res.name;
    });

    const secParam = this.route.snapshot.paramMap.get('sectionId');
    if (secParam) {
      this.sectionId = Number(secParam);
    }

    // Read query params for context
    this.route.queryParams.subscribe(params => {
      this.academicLevel = params.academicLevel || '';
      this.title = this.sectionId
        ? (this.academicLevel === 'Tertiary Education' ? 'Edit Year Level' : 'Edit Section')
        : (this.academicLevel === 'Tertiary Education' ? 'Add Year Level' : 'Add Section');
    });

    this.form = this.fb.group({
      name: ['', Validators.required]
    });

    if (this.sectionId) {
      this.sectionService.getById(this.sectionId).subscribe(res => {
        this.form.patchValue(res);
      });
    }
  }

  submit(): void {

    if (this.form.invalid) return;

    this.submitting = true;

    const rawName = this.form.value.name || '';
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    if (this.sectionId) {
      this.sectionService.update(this.gradeLevelId, this.sectionId, capitalizedName).subscribe(() => {
        this.router.navigate([`/grade-level/${this.gradeLevelId}/sections`]);
      });
    } else {
      this.sectionService.create(this.gradeLevelId, capitalizedName).subscribe(() => {
        this.router.navigate([`/grade-level/${this.gradeLevelId}/sections`]);
      });
    }
  }

  cancel(): void {
    this.router.navigate([`/grade-level/${this.gradeLevelId}/sections`]);
  }
}

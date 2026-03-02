import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService, Subject } from '@app/_services/subjects.service';
import { GradeLevelService } from '@app/_services/grade-level.service';

@Component({
  selector: 'app-subjects-add-edit',
  templateUrl: './subjects-add-edit.component.html'
})
export class SubjectsAddEditComponent implements OnInit {

  form!: FormGroup;
  subjectId?: number;
  gradeLevelId!: number;
  gradeLevelName = '';
  academicLevel = '';

  title = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private subjectsService: SubjectsService,
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

    const subjectParam = this.route.snapshot.paramMap.get('subjectId');
    if (subjectParam) {
      this.subjectId = Number(subjectParam);
    }

    // Read query params for context
    this.route.queryParams.subscribe(params => {
      this.academicLevel = params.academicLevel || '';
      this.title = this.subjectId
        ? (this.academicLevel === 'Tertiary Education' ? 'Edit Year Level' : 'Edit Section')
        : (this.academicLevel === 'Tertiary Education' ? 'Add Year Level' : 'Add Section');
    });

    this.form = this.fb.group({
      name: ['', Validators.required]
    });

    if (this.subjectId) {
      this.subjectsService.getById(this.subjectId).subscribe(res => {
        this.form.patchValue(res);
      });
    }
  }

  submit(): void {

    if (this.form.invalid) return;

    this.submitting = true;

    const rawName = this.form.value.name || '';
    const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    const subject: Subject = {
      name: capitalizedName,
      gradeLevelId: this.gradeLevelId
    };

    if (this.subjectId) {
      this.subjectsService.update(this.subjectId, subject).subscribe(() => {
        this.router.navigate([`/grade-level/${this.gradeLevelId}/subjects`]);
      });
    } else {
      this.subjectsService.create(subject).subscribe(() => {
        this.router.navigate([`/grade-level/${this.gradeLevelId}/subjects`]);
      });
    }
  }

  cancel(): void {
    this.router.navigate([`/grade-level/${this.gradeLevelId}/subjects`]);
  }
}

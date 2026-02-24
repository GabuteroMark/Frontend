import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectsService, Subject } from '@app/_services/subjects.service';

@Component({
  selector: 'app-subjects-add-edit',
  templateUrl: './subjects-add-edit.component.html'
})
export class SubjectsAddEditComponent implements OnInit {

  form!: FormGroup;
  subjectId?: number;
  gradeLevelId!: number;

  title = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const gradeParam = this.route.snapshot.paramMap.get('gradeLevelId');
    if (!gradeParam) {
      alert('Invalid Grade Level');
      this.router.navigate(['/grade-level']);
      return;
    }

    this.gradeLevelId = Number(gradeParam);

    const subjectParam = this.route.snapshot.paramMap.get('subjectId');
    if (subjectParam) {
      this.subjectId = Number(subjectParam);
    }

    this.title = this.subjectId ? 'Edit Subject' : 'Add Subject';

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

    const subject: Subject = {
      name: this.form.value.name,
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { GradeLevelService } from '@app/_services';
import { GradeLevel } from '@app/_models';

@Component({
  selector: 'app-grade-level-add-edit',
  templateUrl: './grade-level-add-edit.component.html'
})
export class GradeLevelAddEditComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  title = 'Add Grade Level';
  id?: number;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private gradeLevelService: GradeLevelService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = paramId ? Number(paramId) : undefined;

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });

    if (this.id) {
      this.title = 'Edit Grade Level';
      this.gradeLevelService.getById(this.id).subscribe({
        next: (data: GradeLevel) => {
          this.form.patchValue({ name: data.name });
        },
        error: (err) => {
          console.error('Failed to load grade level', err);
          this.errorMessage = 'Failed to load grade level.';
        }
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;

    const request$ = this.id
      ? this.gradeLevelService.update(this.id, this.form.value)
      : this.gradeLevelService.create(this.form.value);

    request$
      .pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: () => {
          // ✅ CORRECT ROUTE
          this.router.navigate(['/grade-level']);
        },
        error: (err) => {
          console.error('Save failed:', err);
          alert('Save failed: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
  }

  onCancel(): void {
    // ✅ ALSO FIXED
    this.router.navigate(['/grade-level']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountService, GradeLevelService } from './_services';
import { Account, Role } from './_models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  Role = Role;
  account?: Account | null;
  branch?: any;  // Define the branch property
  gradeLevel: any;
  showAcademicLevels = false;

  constructor(
    private accountService: AccountService,
    private gradeLevelService: GradeLevelService,
    private router: Router
  ) {
    this.accountService.account.subscribe(x => this.account = x);

    // Auto-close menu when navigating away from grade-level pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!event.url.includes('/grade-level')) {
        this.showAcademicLevels = false;
      }
    });
  }

  ngOnInit(): void {
    if (this.account?.role === Role.Admin) {
      this.gradeLevelService.getAll().subscribe((gradeLevels: any[]) => {
        if (gradeLevels.length > 0) {
          this.gradeLevel = gradeLevels[0];
        }
      });
    }
  }


  logout() {
    this.accountService.logout();
  }
}

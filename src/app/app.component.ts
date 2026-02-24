import { Component, OnInit } from '@angular/core';
import { AccountService, GradeLevelService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  Role = Role;
  account?: Account | null;
  branch?: any;  // Define the branch property
  gradeLevel: any;

  constructor(
    private accountService: AccountService,
    private gradeLevelService: GradeLevelService

  ) {
    this.accountService.account.subscribe(x => this.account = x);
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

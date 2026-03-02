import { Component } from '@angular/core';

import { AccountService } from '@app/_services';
import { Role } from '@app/_models';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    account = this.accountService.accountValue;
    Role = Role;

    constructor(private accountService: AccountService) { }
}
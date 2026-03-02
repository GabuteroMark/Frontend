// coordinator-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoordinatorLayoutComponent } from './coordinator-layout.component';
import { CoordinatorSubNavComponent } from './coordinator-subnav.component';
import { CoordinatorOverviewComponent } from './coordinator-overview.component';

const routes: Routes = [
    { path: '', component: CoordinatorSubNavComponent, outlet: 'subnav' },
    {
        path: '',
        component: CoordinatorLayoutComponent,
        children: [
            { path: '', component: CoordinatorOverviewComponent }
            // Add more child routes here as needed
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoordinatorRoutingModule { }

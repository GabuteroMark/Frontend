// coordinator.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoordinatorRoutingModule } from './coordinator-routing.module';
import { CoordinatorLayoutComponent } from './coordinator-layout.component';
import { CoordinatorSubNavComponent } from './coordinator-subnav.component';
import { CoordinatorOverviewComponent } from './coordinator-overview.component';

@NgModule({
    declarations: [
        CoordinatorLayoutComponent,
        CoordinatorSubNavComponent,
        CoordinatorOverviewComponent
    ],
    imports: [
        CommonModule,
        CoordinatorRoutingModule
    ]
})
export class CoordinatorModule { }

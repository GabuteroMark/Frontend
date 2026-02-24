import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const gradeLevelModule = () => import('./grade-level/grade-level.module').then(x => x.GradeLevelModule);


// ✅ New AI Upload module
const aiUploadModule = () => import('./ai-upload/ai-question.module').then(x => x.AIQuestionModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },

    // Branch / Grade-level lazy-loaded module
    {
        path: 'grade-level',
        loadChildren: gradeLevelModule,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
      
    // ✅ AI Upload route
    {
        path: 'ai-upload',
        loadChildren: aiUploadModule,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Staff] } // allow Admin & Staff access
    },

    // Fallback route
    { path: '**', redirectTo: 'grade-level' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

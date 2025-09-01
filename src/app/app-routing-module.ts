import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { UsersListComponent } from './features/admin/utilisateurs/users-list.component';
import { authGuard, adminGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  
  // Auth routes
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  
  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'utilisateurs', component: UsersListComponent },
      { path: 'commandes', component: AdminDashboardComponent }, // TODO: Replace with actual component
      { path: 'livreurs', component: AdminDashboardComponent }, // TODO: Replace with actual component
      { path: 'sorties', component: AdminDashboardComponent } // TODO: Replace with actual component
    ]
  },
  
  // Unauthorized page
  {
    path: 'unauthorized',
    component: LoginComponent // TODO: Create proper unauthorized component
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

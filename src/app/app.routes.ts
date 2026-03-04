import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { BalanceComponent } from './components/balance/balance';
import { RankingComponent } from './components/ranking/ranking';
import { ViralComponent } from './components/viral/viral';
import { TeacherComponent } from './components/teacher/teacher';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'register',  component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'balance',   component: BalanceComponent,   canActivate: [authGuard] },
  { path: 'ranking',   component: RankingComponent },
  { path: 'viral',     component: ViralComponent,     canActivate: [authGuard] },
  { path: 'teacher',   component: TeacherComponent },
  { path: 'profile',   component: ProfileComponent,   canActivate: [authGuard] },
  { path: '**',        redirectTo: 'dashboard' },
];

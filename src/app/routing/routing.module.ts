import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { GeneralviewComponent } from '../components/generalview/generalview.component';
import { ChartsComponent } from '../components/charts/charts.component';
import { AgentsComponent } from '../components/agents/agents.component';
import { TeamComponent } from '../components/team/team.component';
import { ShiftsComponent } from '../components/shifts/shifts.component';
import { LineComponent } from '../components/line/line.component';
import { StopComponent } from '../components/stop/stop.component';
import { VehiclesComponent } from '../components/vehicles/vehicles.component';
import { ScheduleComponent } from '../components/schedule/schedule.component';
import { TransportticketComponent } from '../components/transportticket/transportticket.component';
import { AuthenticationComponent } from '../components/authentication/authentication.component';
import { VerbalizationComponent } from '../components/verbalization/verbalization.component';
import { EmployeeComponent } from '../components/employee/employee.component';
import { ItinerariesComponent } from '../components/itineraries/itineraries.component';

import { AccessGuard } from "../guards/access.guard";
import { AuthGuard } from "../guards/auth.guard";

const appRoutes: Routes = <Routes> [
  {path: 'home', component: HomeComponent, data: { showSidebar: true, showNavbar: true },
   canActivate: [AuthGuard, AccessGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'generalview', component: GeneralviewComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'charts', component: ChartsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'agents', component: AgentsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'team', component: TeamComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'shifts', component: ShiftsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'line', component: LineComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'stop', component: StopComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'transportticket', component: TransportticketComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'authentication', component: AuthenticationComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'verbalization', component: VerbalizationComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'itineraries', component: ItinerariesComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneralComponent } from './components/dashboard/content/general/general.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NotValidAccountComponent } from './components/login/not-valid-account/not-valid-account.component';
import { ProfilComponent } from './components/dashboard/content/profil/profil.component';
import { WaitingRoomComponent } from './components/dashboard/content/waiting-room/waiting-room.component';
import { PatientVisitComponent } from './components/dashboard/content/patient-visit/patient-visit.component';
import { VisitsManagerComponent } from './components/dashboard/content/visits-manager/visits-manager.component';
import { MedicalFilesManagerComponent } from './components/dashboard/content/medical-files-manager/medical-files-manager.component';

const routes: Routes = [
  {
    path: "", redirectTo: "login", pathMatch: "prefix"
  },
  {
    path: "dashboard", component: DashboardComponent, canActivate: [AuthGuardService], children: [
      {
        path: "general", component: GeneralComponent
      } , { 
        path : "profil" , component : ProfilComponent
      } , {
        path : "waiting-room" , component : WaitingRoomComponent 
      } , { 
        path : "visit" , component : PatientVisitComponent
      } , {
        path : "visits" , component : VisitsManagerComponent
      } , { 
        path : "medical-files"  , component : MedicalFilesManagerComponent
      }
    ]
  },

  {
    path: "login", component: LoginComponent
  },
  {
    path: "not-valid-account", component: NotValidAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

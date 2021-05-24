import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneralComponent } from './components/dashboard/content/general/general.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NotValidAccountComponent } from './components/login/not-valid-account/not-valid-account.component';
import { ProfilComponent } from './components/dashboard/content/profil-manager/profil/profil.component';
import { WaitingRoomComponent } from './components/dashboard/content/waiting-room/waiting-room.component';
import { PatientVisitComponent } from './components/dashboard/content/patient-visit/patient-visit.component';
import { VisitsManagerComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-manager/visits-manager.component';
import { MedicalFilesManagerComponent } from './components/dashboard/content/medical-files-manager/medical-files-manager.component';
import { ExpensesManagerComponent } from './components/dashboard/content/financial-manager/expenses-manager/expenses-manager.component';
import { AnalyticsComponent } from './components/dashboard/content/analytics/analytics.component';
import { VisitsAndAppointmentsManagerComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-and-appointments-manager.component';
import { FinancialManagerComponent } from './components/dashboard/content/financial-manager/financial-manager.component';
import { RDVManagerComponent } from './components/dashboard/content/visits-and-appointments-manager/rdvmanager/rdvmanager.component';
import { DebtManagerComponent } from './components/dashboard/content/financial-manager/debt-manager/debt-manager.component';
import { DocumentsAndDiagnosisComponent } from './components/dashboard/content/documents-and-diagnosis/documents-and-diagnosis.component';
import { DocumentsManagerComponent } from './components/dashboard/content/documents-and-diagnosis/documents-manager/documents-manager.component';
import { DiagnosisManagerComponent } from './components/dashboard/content/documents-and-diagnosis/diagnosis-manager/diagnosis-manager.component';
import { PrescriptionManagerComponent } from './components/dashboard/content/prescription-manager/prescription-manager.component';
import { ProfilManagerComponent } from './components/dashboard/content/profil-manager/profil-manager.component';
import { StructureComponent } from './components/dashboard/content/profil-manager/structure/structure.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: "", redirectTo: "login", pathMatch: "prefix"
  },
  {
    path: "dashboard", component: DashboardComponent, canActivate: [AuthGuardService], children: [
      {
        path: "general", component: GeneralComponent
      } , { 
        path : "profil-manager" , component : ProfilManagerComponent , children : [
          { 
            path : "profil" , component : ProfilComponent 
          } , { 
            path : "structure" , component : StructureComponent
          }
        ]
      } , {
        path : "waiting-room" , component : WaitingRoomComponent 
      } , { 
        path : "visit" , component : PatientVisitComponent
      } , {
        path : "visits-and-appointments-manager" , component : VisitsAndAppointmentsManagerComponent , children : [
          {
            path : "visits" , component : VisitsManagerComponent 
          }, { 
            path : "appointments" , component : RDVManagerComponent
          }
        ]
      } , { 
        path : "medical-files"  , component : MedicalFilesManagerComponent
      } , { 
        path :"financial-manager" , component : FinancialManagerComponent , children : [
          { 
            path : "expenses" , component : ExpensesManagerComponent
          } , { 
            path : "debt" , component : DebtManagerComponent
          }
        ]
      } , { 
        path : "analytics" , component : AnalyticsComponent 
      } , { 
        path : "documents-and-diagnosis" , component : DocumentsAndDiagnosisComponent , children : [
          { 
            path : "documents" , component : DocumentsManagerComponent , 

          }, { 
            path : "diagnosis" , component : DiagnosisManagerComponent
          }
        ]
      }, { 
        path : "prescription-manager/:page" , component : PrescriptionManagerComponent 
      }
    ]
  },

  {
    path: "login", component: LoginComponent
  },
  {
    path : "sign-up" , component : SignUpComponent
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

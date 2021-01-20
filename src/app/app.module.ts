import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagnosisComponent } from './components/diagnosis/diagnosis.component';
import { ImageViewerComponent } from './components/global/image-viewer/image-viewer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SideBarComponent } from './components/dashboard/side-bar/side-bar.component';
import { ContentComponent } from './components/dashboard/content/content.component';
import { GeneralComponent } from './components/dashboard/content/general/general.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { ChartsModule } from 'ng2-charts';
import { GeneralLineChartComponent } from './components/dashboard/content/general/general-line-chart/general-line-chart.component';
import { GeneralLineChartHeaderComponent } from './components/dashboard/content/general/general-line-chart/general-line-chart-header/general-line-chart-header.component';
import { EvolutionCartComponent } from './components/global/evolution-cart/evolution-cart.component';
import { GeneralWaitingRoomComponent } from './components/dashboard/content/general/general-waiting-room/general-waiting-room.component';
import { GeneralDiseaseReportComponent } from './components/dashboard/content/general/general-disease-report/general-disease-report.component';
import { GeneralWaitingRoomPatientComponent } from './components/dashboard/content/general/general-waiting-room/general-waiting-room-patient/general-waiting-room-patient.component';
import { GeneralSubscriptionComponent } from './components/dashboard/content/general/general-subscription/general-subscription.component';
import { PopUpWindowComponent } from './components/global/pop-up-window/pop-up-window.component';
import { RouterModule } from '@angular/router';
import { HumanBodyComponent } from './components/diagnosis/human-body/human-body.component';
import { SpecialityDiagnosisComponent } from './components/diagnosis/speciality-diagnosis/speciality-diagnosis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiagnosisPredictionsComponent } from './components/diagnosis/diagnosis-predictions/diagnosis-predictions.component';
import { PredictionComponent } from './components/diagnosis/diagnosis-predictions/prediction/prediction.component';
import { ProgressBarComponent } from './components/global/progress-bar/progress-bar.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { DiagnosisResultComponent } from './components/diagnosis/speciality-diagnosis/diagnosis-result/diagnosis-result.component';
import { ImagesGridComponent } from './components/diagnosis/speciality-diagnosis/diagnosis-result/images-grid/images-grid.component';
import { GridControllerComponent } from './components/diagnosis/speciality-diagnosis/diagnosis-result/images-grid/grid-controller/grid-controller.component';
import { DiagnosisRegionsComponent } from './components/diagnosis/diagnosis-regions/diagnosis-regions.component';
import { RegionComponent } from './components/diagnosis/diagnosis-regions/region/region.component';
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { PatientInfoComponent } from './components/diagnosis/patient-info/patient-info.component';
import { AllSymptomsComponent } from './components/diagnosis/all-symptoms/all-symptoms.component';
import { SelectedSymptomsComponent } from './components/diagnosis/selected-symptoms/selected-symptoms.component';
import { LoginComponent } from './components/login/login.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { NotValidAccountComponent } from './components/login/not-valid-account/not-valid-account.component';
import { AskForPremiumWindowComponent } from './components/global/ask-for-premium-window/ask-for-premium-window.component';
import { FeedbackWindowComponent } from './components/global/feedback-window/feedback-window.component';
import { ProfilComponent } from './components/dashboard/content/profil/profil.component';
import { GeneralInformationComponent } from './components/dashboard/content/profil/general-information/general-information.component';
import { CabinetInformationComponent } from './components/dashboard/content/profil/cabinet-information/cabinet-information.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesComponent } from './components/dashboard/content/profil/cabinet-information/services/services.component';
import { ServiceSubmitterComponent } from './components/dashboard/content/profil/cabinet-information/service-submitter/service-submitter.component';
import { AssistantManagerComponent } from './components/dashboard/content/profil/assistant-manager/assistant-manager.component';
import { MedicalActManagerComponent } from './components/dashboard/content/profil/medical-act-manager/medical-act-manager.component';
import { AssistantSubmitterComponent } from './components/dashboard/content/profil/assistant-manager/assistant-submitter/assistant-submitter.component';
import { AssistantComponent } from './components/dashboard/content/profil/assistant-manager/assistant/assistant.component';
import { YesNoMessageComponent } from './components/global/yes-no-message/yes-no-message.component';
import { MedicalActSubmitterComponent } from './components/dashboard/content/profil/medical-act-manager/medical-act-submitter/medical-act-submitter.component';
import { WaitingRoomComponent } from './components/dashboard/content/waiting-room/waiting-room.component';
import { CalendarComponent } from './components/dashboard/content/waiting-room/calendar/calendar.component';
import { AppointmentsManagerComponent } from './components/dashboard/content/waiting-room/appointments-manager/appointments-manager.component';
import { AppointmentsControllerComponent } from './components/dashboard/content/waiting-room/appointments-manager/appointments-controller/appointments-controller.component';
import { PatientsListComponent } from './components/dashboard/content/waiting-room/appointments-manager/patients-list/patients-list.component';
import { VisitComponent } from './components/dashboard/content/waiting-room/appointments-manager/patients-list/visit/visit.component';
import { NewVisitComponent } from './components/dashboard/content/waiting-room/new-visit/new-visit.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagnosisComponent,
    ImageViewerComponent,
    DashboardComponent,
    SideBarComponent,
    ContentComponent,
    GeneralComponent,
    HeaderComponent,
    GeneralLineChartComponent,
    GeneralLineChartHeaderComponent,
    EvolutionCartComponent,
    GeneralWaitingRoomComponent,
    GeneralDiseaseReportComponent,
    GeneralWaitingRoomPatientComponent,
    GeneralSubscriptionComponent,
    PopUpWindowComponent,
    HumanBodyComponent,
    SpecialityDiagnosisComponent,
    DiagnosisPredictionsComponent,
    PredictionComponent,
    ProgressBarComponent,
    DiagnosisResultComponent,
    ImagesGridComponent,
    GridControllerComponent,
    DiagnosisRegionsComponent,
    RegionComponent,
    PatientInfoComponent,
    AllSymptomsComponent,
    SelectedSymptomsComponent,
    LoginComponent,
    NotValidAccountComponent,
    AskForPremiumWindowComponent,
    FeedbackWindowComponent,
    ProfilComponent,
    GeneralInformationComponent,
    CabinetInformationComponent,
    ServicesComponent,
    ServiceSubmitterComponent,
    AssistantManagerComponent,
    MedicalActManagerComponent,
    AssistantSubmitterComponent,
    AssistantComponent,
    YesNoMessageComponent,
    MedicalActSubmitterComponent,
    WaitingRoomComponent,
    CalendarComponent,
    AppointmentsManagerComponent,
    AppointmentsControllerComponent,
    PatientsListComponent,
    VisitComponent,
    NewVisitComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    RouterModule,
    FormsModule,
    ApolloModule,
    NgxImageZoomModule , 
    HttpLinkModule , 
    ReactiveFormsModule, BrowserAnimationsModule   
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({uri: "http://127.0.0.1:5000/graphql"}) , 
      cache: new InMemoryCache()
    })
  }
}

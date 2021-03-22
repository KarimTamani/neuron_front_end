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
import { SearchInputComponent } from './components/global/search-input/search-input.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NewMedicalFileComponent } from './components/dashboard/content/waiting-room/new-medical-file/new-medical-file.component';
import { AntecedentsSubmitterComponent } from './components/dashboard/content/waiting-room/new-medical-file/antecedents-submitter/antecedents-submitter.component';
import { MiniMedicalFileComponent } from './components/dashboard/content/waiting-room/new-visit/mini-medical-file/mini-medical-file.component';
import { DefaultOptions } from 'apollo-client';
import { DragDropModule} from "@angular/cdk/drag-drop";
import { PayeVisitComponent } from './components/dashboard/content/waiting-room/appointments-manager/patients-list/visit/paye-visit/paye-visit.component';
import { WaitingRoomReportComponent } from './components/dashboard/content/waiting-room/calendar/waiting-room-report/waiting-room-report.component';
import { VitalSettingComponent } from './components/dashboard/content/waiting-room/new-visit/vital-setting/vital-setting.component';
import { PatientVisitComponent } from './components/dashboard/content/patient-visit/patient-visit.component';
import { VisitHeaderComponent } from './components/dashboard/content/patient-visit/visit-header/visit-header.component';
import { VisitInformationComponent } from './components/dashboard/content/patient-visit/visit-information/visit-information.component';
import { VisitPrescriptionComponent } from './components/dashboard/content/patient-visit/visit-prescription/visit-prescription.component';
import { VisitCheckUpComponent } from './components/dashboard/content/patient-visit/visit-check-up/visit-check-up.component';
import { VisitDocumentsComponent } from './components/dashboard/content/patient-visit/visit-documents/visit-documents.component';
import { VisitLoaderComponent } from './components/dashboard/content/patient-visit/visit-information/visit-loader/visit-loader.component';
import { VisitClincalExamComponent } from './components/dashboard/content/patient-visit/visit-information/visit-clincal-exam/visit-clincal-exam.component';
import { VisitVitalSettingComponent } from './components/dashboard/content/patient-visit/visit-information/visit-vital-setting/visit-vital-setting.component';
import { VisitMedicalActsComponent } from './components/dashboard/content/patient-visit/visit-information/visit-medical-acts/visit-medical-acts.component';
import { ClincalExamManagerComponent } from './components/dashboard/content/patient-visit/clincal-exam-manager/clincal-exam-manager.component';
import { ClincalExamListComponent } from './components/dashboard/content/patient-visit/clincal-exam-manager/clincal-exam-list/clincal-exam-list.component';
import { AddClincalExamComponent } from './components/dashboard/content/patient-visit/clincal-exam-manager/add-clincal-exam/add-clincal-exam.component';
import { MedicalFilesManagerComponent } from './components/dashboard/content/medical-files-manager/medical-files-manager.component';
import { VisitsManagerComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-manager/visits-manager.component';
import { SearchHeaderComponent } from './components/global/search-header/search-header.component';
import { VisitsListComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-manager/visits-list/visits-list.component';
import { VisitRowComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-manager/visits-list/visit-row/visit-row.component';
import { PaginationComponent } from './components/global/pagination/pagination.component';
import { MedicalFileAdvancedSearchComponent } from './components/dashboard/content/medical-files-manager/medical-file-advanced-search/medical-file-advanced-search.component';
import { VisitAdvancedSearchComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-manager/visit-advanced-search/visit-advanced-search.component';
import { DateIntervalComponent } from './components/global/date-interval/date-interval.component';
import { DrugSubmitterComponent } from './components/dashboard/content/patient-visit/visit-prescription/drug-submitter/drug-submitter.component';
import { PrescriptionComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription.component';
import { DrugDosageComponent } from './components/dashboard/content/patient-visit/visit-prescription/drug-submitter/drug-dosage/drug-dosage.component';
import { PrescriptionHeaderComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-header/prescription-header.component';
import { PrescriptionDrugDosagesComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-drug-dosages/prescription-drug-dosages.component';
import { PrescriptionPatientInfoComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-patient-info/prescription-patient-info.component';
import { PrescriptionDrugDosageComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-drug-dosages/prescription-drug-dosage/prescription-drug-dosage.component';
import { PrescriptionFooterComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-footer/prescription-footer.component';
import { VisitAppointmentComponent } from './components/dashboard/content/patient-visit/visit-appointment/visit-appointment.component';
import { ExpensesManagerComponent } from './components/dashboard/content/financial-manager/expenses-manager/expenses-manager.component';
import { ExpensesHeaderComponent } from './components/dashboard/content/financial-manager/expenses-manager/expenses-header/expenses-header.component';
import { AddExpenseComponent } from './components/dashboard/content/financial-manager/expenses-manager/add-expense/add-expense.component';
import { ExpenseComponent } from './components/dashboard/content/financial-manager/expenses-manager/expense/expense.component';
import { AnalyticsComponent } from './components/dashboard/content/analytics/analytics.component';
import { GeneralAnalyticsComponent } from './components/dashboard/content/analytics/general-analytics/general-analytics.component';
import { GroupAnalyticsComponent } from './components/dashboard/content/analytics/group-analytics/group-analytics.component';
import { AnalyticsHeaderComponent } from './components/dashboard/content/analytics/general-analytics/analytics-header/analytics-header.component';
import { GroupAnalyticsHeaderComponent } from './components/dashboard/content/analytics/group-analytics/group-analytics-header/group-analytics-header.component';
import { EvolutionAnalyticsComponent } from './components/dashboard/content/analytics/evolution-analytics/evolution-analytics.component';
import { CommingAppointmentsComponent } from './components/dashboard/content/analytics/comming-appointments/comming-appointments.component';
import { RecentPatientsComponent } from './components/dashboard/content/analytics/recent-patients/recent-patients.component';
import { AnalyticsAppointmentComponent } from './components/dashboard/content/analytics/comming-appointments/analytics-appointment/analytics-appointment.component';
import { FinancialManagerComponent } from './components/dashboard/content/financial-manager/financial-manager.component';
import { VisitsAndAppointmentsManagerComponent } from './components/dashboard/content/visits-and-appointments-manager/visits-and-appointments-manager.component';
import { RDVManagerComponent } from './components/dashboard/content/visits-and-appointments-manager/rdvmanager/rdvmanager.component';
import { RDVSearchHeaderComponent } from './components/dashboard/content/visits-and-appointments-manager/rdvmanager/rdvsearch-header/rdvsearch-header.component';
import { DebtManagerComponent } from './components/dashboard/content/financial-manager/debt-manager/debt-manager.component';
import { DebtSearchHeaderComponent } from './components/dashboard/content/financial-manager/debt-manager/debt-search-header/debt-search-header.component';
import { DrugDosagesLibraryComponent } from './components/dashboard/content/patient-visit/visit-prescription/drug-dosages-library/drug-dosages-library.component';
import { PrescriptionModelComponent } from './components/dashboard/content/patient-visit/visit-prescription/drug-dosages-library/prescription-model/prescription-model.component';
import { PrescriptionModelSubmitterComponent } from './components/dashboard/content/patient-visit/visit-prescription/drug-dosages-library/prescription-model-submitter/prescription-model-submitter.component';
import { CheckUpSubmitterComponent } from './components/dashboard/content/patient-visit/visit-check-up/check-up-submitter/check-up-submitter.component';
import { CheckUpTypeComponent } from './components/dashboard/content/patient-visit/visit-check-up/check-up-submitter/check-up-type/check-up-type.component';
import { CheckUpComponent } from './components/dashboard/content/patient-visit/visit-check-up/check-up-submitter/check-up-type/check-up/check-up.component';
import { PrescriptionCheckUpComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-check-up/prescription-check-up.component';
import { DocumentComponent } from './components/dashboard/content/patient-visit/visit-documents/document/document.component';
import { DocumentSubmitterComponent } from './components/dashboard/content/patient-visit/visit-documents/document-submitter/document-submitter.component';
import { VisitDiagnosisComponent } from './components/dashboard/content/patient-visit/visit-diagnosis/visit-diagnosis.component';
import { NeuronResponseComponent } from './components/dashboard/content/patient-visit/visit-diagnosis/neuron-response/neuron-response.component';
import { DocumentsAndDiagnosisComponent } from './components/dashboard/content/documents-and-diagnosis/documents-and-diagnosis.component';
import { DocumentsManagerComponent } from './components/dashboard/content/documents-and-diagnosis/documents-manager/documents-manager.component';
import { DiagnosisManagerComponent } from './components/dashboard/content/documents-and-diagnosis/diagnosis-manager/diagnosis-manager.component';
import { DocumentsSearchHeaderComponent } from './components/dashboard/content/documents-and-diagnosis/documents-manager/documents-search-header/documents-search-header.component';
import { DiagnosisSearchHeaderComponent } from './components/dashboard/content/documents-and-diagnosis/diagnosis-manager/diagnosis-search-header/diagnosis-search-header.component';
import { DocumentInfoComponent } from './components/dashboard/content/patient-visit/visit-documents/document/document-info/document-info.component';
import { VisitCertificatesComponent } from './components/dashboard/content/patient-visit/visit-certificates/visit-certificates.component' ; 
import { NgxEditorModule } from 'ngx-editor';
import { CertificatSubmitterComponent } from './components/dashboard/content/patient-visit/visit-certificates/certificat-submitter/certificat-submitter.component';
import { PrescriptionCertificatComponent } from './components/dashboard/content/patient-visit/visit-prescription/prescription/prescription-certificat/prescription-certificat.component';


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
    SearchInputComponent,
    NewMedicalFileComponent,
    AntecedentsSubmitterComponent,
    MiniMedicalFileComponent,
    PayeVisitComponent,
    WaitingRoomReportComponent,
    VitalSettingComponent,
    PatientVisitComponent,
    VisitHeaderComponent,
    VisitInformationComponent,
    VisitPrescriptionComponent,
    VisitCheckUpComponent,
    VisitDocumentsComponent,
    VisitLoaderComponent,
    VisitClincalExamComponent,
    VisitVitalSettingComponent,
    VisitMedicalActsComponent,
    ClincalExamManagerComponent,
    ClincalExamListComponent,
    AddClincalExamComponent,
    MedicalFilesManagerComponent,
    VisitsManagerComponent,
    SearchHeaderComponent,
    VisitsListComponent,
    VisitRowComponent,
    PaginationComponent,
    MedicalFileAdvancedSearchComponent,
    VisitAdvancedSearchComponent,
    DateIntervalComponent,
    DrugSubmitterComponent,
    PrescriptionComponent,
    DrugDosageComponent,
    PrescriptionHeaderComponent,
    PrescriptionDrugDosagesComponent,
    PrescriptionPatientInfoComponent,
    PrescriptionDrugDosageComponent,
    PrescriptionFooterComponent,
    VisitAppointmentComponent,
    ExpensesManagerComponent,
    ExpensesHeaderComponent,
    AddExpenseComponent,
    ExpenseComponent,
    AnalyticsComponent,
    GeneralAnalyticsComponent,
    GroupAnalyticsComponent,
    AnalyticsHeaderComponent,
    GroupAnalyticsHeaderComponent,
    EvolutionAnalyticsComponent,
    CommingAppointmentsComponent,
    RecentPatientsComponent,
    AnalyticsAppointmentComponent,
    FinancialManagerComponent,
    VisitsAndAppointmentsManagerComponent,
    RDVManagerComponent,
    RDVSearchHeaderComponent,
    DebtManagerComponent,
    DebtSearchHeaderComponent,
    DrugDosagesLibraryComponent,
    PrescriptionModelComponent,
    PrescriptionModelSubmitterComponent,
    CheckUpSubmitterComponent,
    CheckUpTypeComponent,
    CheckUpComponent,
    PrescriptionCheckUpComponent,
    DocumentComponent,
    DocumentSubmitterComponent,
    VisitDiagnosisComponent,
    NeuronResponseComponent,
    DocumentsAndDiagnosisComponent,
    DocumentsManagerComponent,
    DiagnosisManagerComponent,
    DocumentsSearchHeaderComponent,
    DiagnosisSearchHeaderComponent,
    DocumentInfoComponent,
    VisitCertificatesComponent,
    CertificatSubmitterComponent,
    PrescriptionCertificatComponent,
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
    ReactiveFormsModule, BrowserAnimationsModule  , 
    AutocompleteLibModule , 
    DragDropModule , 
    NgxEditorModule

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
  private  defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({uri: "http://127.0.0.1:5000/graphql"}) , 
      cache: new InMemoryCache({addTypename: false}),
      defaultOptions : this.defaultOptions  , 
      
    })
  }
}

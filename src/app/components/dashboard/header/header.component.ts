import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public doctor: any = null;
  public subscriptions: Subscription[] = [];
  public title: string;
  public activeSearch: boolean = false;
  public query: string = "";

  public medicalFiles: MedicalFile[] = [];
  public searchHandler: any = null;

  @ViewChild("queryInput", { static: true }) queryInput: any;
  public currentDate: Date;



  constructor(
    private router: Router,
    private apollo: Apollo,
    private interactionService: InteractionService,
    private dataService: DataService,
    private virtualAssistantService: VirtualAssistantService) { }

  ngOnInit(): void {
    this.doctor = JSON.parse(localStorage.getItem("doctorAuth")).doctor;
    this.title = this.getPageTitle(this.router.url);

    this.subscriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.title = this.getPageTitle(this.router.url);
      }
    }));


    this.subscriptions.push(this.apollo.query({
      query: gql`
        { 
          getCurrentDate
        }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((date) => {
      this.currentDate = new Date(date)  ;
      setInterval(() => { 
        this.currentDate = new Date(this.currentDate.getTime() + 1000) ; 
      } , 1000 )
    })
    )
    this.subscriptions.push(this.virtualAssistantService.onVACommand.subscribe((command) => {

      if (command.component == "SEARCH") {
        this.query = command.query;
        this.queryInput.nativeElement.focus()
        this.search();
      }

    }))
  }

  get getCurrentDate() {
    if (!this.currentDate) {
      return null;
    }
    var frDate  = this.dataService.castFRDate(this.currentDate) ; 
    var time = this.dataService.getTime(this.currentDate)  ;

    console.log(frDate , time) ; 
    return frDate +" "+  time ; 

  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }


  public getPageTitle(url: string) {
    if (url.includes("general"))
      return "Accueil";

    else if (url.includes("waiting-room"))
      return "Salle d'attente";

    else if (url.includes("visits-and-appointments-manager"))
      return "Gestion des Visites";

    else if (url.includes("medical-files"))
      return "Dossier médicaux";

    else if (url.includes("profil"))
      return "Profil";

    else if (url.includes("visit"))
      return "Visite ";

    else if (url.includes("financial-manager"))
      return "Gestion Financière";

    else if (url.includes("analytics"))
      return "Statistiques";

    else if (url.includes("documents-and-diagnosis"))
      return "Documents et diagnostiques";

    else if (url.includes("prescription-manager"))
      return "Gestion des prescriptions";
  }


  public onFocus() {
    this.interactionService.blackBackgroundActive.next(true);
    this.activeSearch = true;
  }


  public onBlur() {
    setTimeout(() => {
      this.interactionService.blackBackgroundActive.next(false);
      this.activeSearch = false;
      this.medicalFiles = [];
      this.query = "";

    }, 200)
  }


  public selectMedicalFile(medicalFile) {


    this.router.navigate([], {
      queryParams: {
        "window-page": "medical-file-details",
        "pop-up-window": true,
        "title": "Dossie Médical",
        "medical-file-id": medicalFile.id
      }
    });



  }

  public search() {

    if (this.searchHandler != null)
      clearTimeout(this.searchHandler);
    if (this.query.trim().length > 0)
      this.searchHandler = setTimeout(() => {
        this.apollo.query({
          query: gql`
            { 
              searchMedicalFiles(searchQuery : "${this.query}") { 
                rows { 
                  id name lastname birthday phone email 
                }
              }
            }
          
          `
        }).pipe(map(value => (<any>value.data).searchMedicalFiles.rows)).subscribe((data) => {
          this.medicalFiles = data;
        })
      }, 200);
    else
      this.medicalFiles = [];
  }


  public frDate(date: string) {

    return this.dataService.castFRDate(new Date(date));
  }
}

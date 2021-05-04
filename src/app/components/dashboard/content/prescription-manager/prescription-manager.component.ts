import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Certificat } from 'src/app/classes/Certificat';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prescription-manager',
  templateUrl: './prescription-manager.component.html',
  styleUrls: ['./prescription-manager.component.css']
})
export class PrescriptionManagerComponent implements OnInit, OnDestroy {
  public selectedOption: string;
  public subscriptions: Subscription[] = [];
  public visit: Visit;
  public certificatType: string = "Certificat";
  public checkUpTypes: CheckUpType[] = [];
  public selectedCertificat: Certificat;

  constructor(
    private router: Router,
    private apollo: Apollo,
    private dataService: DataService) {
  }
  ngOnInit(): void {
    this.visit = new Visit();
    this.apollo.query({
      query: gql`
        { 
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      // calculate the age of the patinet example based from the date of today with an age of 24 years old 
      this.visit.createdAt = new Date(data).toString();
    })
    this.subscriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateOptions()
      }
    }));
    this.apollo.query({
      query: gql`
        {  
          getCheckUpTypes { id name isPublic checkUps  { id name checkUpTypeId isPublic}}
        }`
    }
    ).pipe(map(value => (<any>value.data).getCheckUpTypes)).subscribe((data) => {
      this.checkUpTypes = data;
    });
    this.updateOptions();
    this.selectedCertificat = new Certificat();
  }

  private updateOptions() {
    if (this.router.url.endsWith("prescriptions"))
      this.selectedOption = "prescriptions";
    else if (this.router.url.endsWith("check-ups"))
      this.selectedOption = "check-ups";
    else if (this.router.url.endsWith("certificats"))
      this.selectedOption = "certificats";
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  get prescriptionType() {
    if (this.selectedOption == "prescriptions")
      return "drug-dosages";

    if (this.selectedOption == "check-ups")
      return "prescription-check-up";

    if (this.selectedOption == "certificats")
      return "prescription-certificat";
  }

  get prescriptionTitle() {

    if (this.selectedOption == "prescriptions")
      return "Ordonnance";
    if (this.selectedOption == "check-ups")
      return "Demande de bilan"
    if (this.selectedOption == "certificats" && this.certificatType == "Certificat")
      return "Certificat Médical";
    else if (this.selectedOption == "certificats" && this.certificatType == "Compte-Rendu")
      return "Compte-Rendu"
  }

  public typeChanged($event) {
    this.certificatType = $event;
  }

  public usePrescription($event) {
    if ($event != null)
      this.visit.visitDrugDosages = $event.drugDosages;
    else
      this.visit.visitDrugDosages = [];

  }

  public selectCertificat($event) {

    this.selectedCertificat.certificatModel = $event;
    this.selectedCertificat.html = $event.html;

  }
}

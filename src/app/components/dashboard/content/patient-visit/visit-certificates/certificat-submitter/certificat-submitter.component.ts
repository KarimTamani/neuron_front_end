import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'; 
import { map } from 'rxjs/operators';
import { Certificat } from 'src/app/classes/Certificat';
import { CertificatModel } from 'src/app/classes/CertificatModel';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';
@Component({
  selector: 'app-certificat-submitter',
  templateUrl: './certificat-submitter.component.html',
  styleUrls: ['./certificat-submitter.component.css']
})
export class CertificatSubmitterComponent implements OnInit {

  public certificatTypes: string[] = [
    "Certificat",
    "Compte-Rendu"
  ];

  public selectedType: string;
  public certificatModels: CertificatModel[] = [];
  public newCertificat: Certificat; 
  public isEdit : boolean = false ; 
  public selectedCertificat : Certificat = null ; 

  @Input() visit: Visit;
  @Output() selectCertificat: EventEmitter<Certificat>;

  constructor(private apollo: Apollo, private router: Router, private interactionService: InteractionService) {
    this.selectedType = this.certificatTypes[0];
    this.selectCertificat = new EventEmitter<Certificat>();
  }
  ngOnInit(): void {

    this.apollo.query({
      query: gql`
          query {
            getCertificatModels {
              id title type html createdAt updatedAt type isPublic 
            }
          }`
    }).pipe(map(value => (<any>value.data).getCertificatModels)).subscribe((data) => {
      this.certificatModels = data;
    })
  }

  public openModels() {
    
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "certificat-models",
        "models": decodeURIComponent(JSON.stringify(this.certificatModels.filter(value => value.type == this.selectedType))),
        "title": "Choisie un Model de Certificat"
      }
    });

    const subscription = this.interactionService.certificatModelSelected.subscribe((data) => {
      this.isEdit = false ; 
      this.newCertificat = new Certificat();
      this.newCertificat.certificatModel = data;
      this.newCertificat.html = data.html;
      this.newCertificat.id = new Date().getTime();

      subscription.unsubscribe();

      this.selectCertificat.emit(this.newCertificat);
    })
  }

  public back() {
    this.newCertificat = null;
    this.selectCertificat.emit(this.selectedCertificat);
  }

  public add($event) {
    this.visit.certificats.splice(0, 0, $event);
    this.selectedCertificat = $event ; 
    this.selectCertificat.emit(this.selectedCertificat) ; 
    this.newCertificat = null ; 
  }

  public openCertificat(certificat) { 
    this.isEdit = true ; 
    this.newCertificat = certificat ; 
    this.select(certificat) ; 
  }


  public select(certificat) { 
    this.selectedCertificat = certificat ; 
    this.selectCertificat.emit(this.selectedCertificat) ;   
  
  }
 
}

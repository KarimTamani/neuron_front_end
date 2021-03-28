import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Certificat } from 'src/app/classes/Certificat'; 
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
  public newCertificat: Certificat; 
  public isEdit : boolean = false ; 
  @Input() selectedCertificat : Certificat = null ; 

  @Input() visit: Visit;
  @Output() selectCertificat: EventEmitter<Certificat>;

  constructor(private apollo: Apollo, private router: Router, private interactionService: InteractionService) {
    this.selectedType = this.certificatTypes[0];
    this.selectCertificat = new EventEmitter<Certificat>();
  }
  ngOnInit(): void {

  }

  public openModels() {
    
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "certificat-models",
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
 
  public remove(certificat) { 
    
    const index = this.visit.certificats.findIndex(value => value.id == certificat.id) ;
    if (this.selectedCertificat && this.selectedCertificat.id == this.visit.certificats[index].id) { 
      this.selectedCertificat = null ; 
      this.selectCertificat.emit(this.selectedCertificat) ; 
    }
    if (index >= 0 ) { 
      this.visit.certificats.splice(index , 1) ; 
    }
  }
}

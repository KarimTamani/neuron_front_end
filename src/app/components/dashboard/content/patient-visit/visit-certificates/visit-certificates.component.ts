import { Component, Input, OnInit } from '@angular/core';
import { Certificat } from 'src/app/classes/Certificat';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-certificates',
  templateUrl: './visit-certificates.component.html',
  styleUrls: ['./visit-certificates.component.css']
})
export class VisitCertificatesComponent implements OnInit {
  
  @Input() visit : Visit ; 
  public selectedCertificat : Certificat ;
  constructor() {}
    
  ngOnInit(): void {
    if (this.visit.certificats.length > 0) { 
      this.selectedCertificat = this.visit.certificats[0] ; 
    }  
  }

  selectCertificat($event) { 
    this.selectedCertificat = $event ; 
  }
}

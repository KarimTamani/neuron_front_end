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
  
  
  }


  selectCertificat($event) { 
    this.selectedCertificat = $event ; 
  }
}

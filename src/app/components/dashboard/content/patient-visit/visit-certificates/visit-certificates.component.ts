import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-certificates',
  templateUrl: './visit-certificates.component.html',
  styleUrls: ['./visit-certificates.component.css']
})
export class VisitCertificatesComponent implements OnInit {
  @Input() visit : Visit ; 
  public certificat : any = {
    content : "<p>Je soussigné Dr <strong>Tamani Karim</strong></p>" 
  }
  constructor() {}
  ngOnInit(): void {
    console.log (this.visit.certificats) ; 
  }
}

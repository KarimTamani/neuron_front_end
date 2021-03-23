import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prescription-certificat',
  templateUrl: './prescription-certificat.component.html',
  styleUrls: ['./prescription-certificat.component.css']
})
export class PrescriptionCertificatComponent implements OnInit {
  @Input() certificat : any ; 
  constructor() { }

  ngOnInit(): void {
    console.log(this.certificat) ; 
  }

}

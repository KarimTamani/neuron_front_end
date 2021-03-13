import { Component, Input, OnInit } from '@angular/core';
import { Cabinet } from 'src/app/classes/Cabinet';
import { Doctor } from 'src/app/classes/Doctor';
import { Service } from 'src/app/classes/Service';

@Component({
  selector: 'app-prescription-header',
  templateUrl: './prescription-header.component.html',
  styleUrls: ['./prescription-header.component.css']
})
export class PrescriptionHeaderComponent implements OnInit {
  @Input() cabinet: Cabinet;
  @Input() doctor: Doctor;
  @Input() title: string ;
  public servicesFr: Service[] = [];
  public servicesAr: Service[] = [];
  constructor() { }

  ngOnInit(): void {
    if (this.cabinet.services) {
      this.servicesFr = this.cabinet.services.filter(value => value.language == "FR") ; 
      this.servicesAr = this.cabinet.services.filter(value => value.language == "AR") ; 
    }  
  }

}

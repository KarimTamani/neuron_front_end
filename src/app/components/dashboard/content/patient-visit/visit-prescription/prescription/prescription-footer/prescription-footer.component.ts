import { Component, Input, OnInit } from '@angular/core';
import { Cabinet } from 'src/app/classes/Cabinet';
import { Doctor } from 'src/app/classes/Doctor';

@Component({
  selector: 'app-prescription-footer',
  templateUrl: './prescription-footer.component.html',
  styleUrls: ['./prescription-footer.component.css']
})
export class PrescriptionFooterComponent implements OnInit {
  @Input() cabinet : Cabinet ; 
  @Input() doctor : Doctor
  constructor() { }

  ngOnInit(): void {
    console.log(this.doctor , this.cabinet) ; 
  }

}

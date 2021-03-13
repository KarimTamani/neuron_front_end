import { Component, Input, OnInit } from '@angular/core';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-prescription-check-up',
  templateUrl: './prescription-check-up.component.html',
  styleUrls: ['./prescription-check-up.component.css']
})
export class PrescriptionCheckUpComponent implements OnInit {
  @Input() visit: Visit;
  @Input() checkUpTypes: CheckUpType[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  get checkUps(): CheckUpType[] {

    let types: CheckUpType[] = [];
    for (let index = 0; index < this.visit.checkUps.length; index++) {
      let source = this.checkUpTypes.findIndex((value) => value.id == this.visit.checkUps[index].checkUpTypeId);
      let sourceType = this.checkUpTypes[source];
      let target = types.findIndex(value => value.id == sourceType.id) ; 
      if (target >= 0) { 
        types[target].checkUps.push(this.visit.checkUps[index]) ; 
      } else { 
        let type = new CheckUpType( ) ; 
        type.name = sourceType.name ; 
        type.id = sourceType.id ; 
        type.checkUps.push(this.visit.checkUps[index]) ; 
        types.push(type) ; 
      }
    }
    console.log(types) ; 
    return types ; 
  }
}

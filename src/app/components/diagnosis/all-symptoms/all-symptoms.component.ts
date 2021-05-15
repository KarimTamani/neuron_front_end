import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from "rxjs/operators";
@Component({
  selector: 'app-all-symptoms',
  templateUrl: './all-symptoms.component.html',
  styleUrls: ['./all-symptoms.component.css']
})
export class AllSymptomsComponent implements OnInit {

  @Input() bodyParts: any[] = [];
  public selectedPart: any = null;
  @Input() selectedSymptoms: any[];
  // create an event emitter to emit every time a symptom updated 
  @Output() symptomsUpdated: EventEmitter<null>;

  constructor(private apollo: Apollo) {
    this.symptomsUpdated = new EventEmitter<null>();
  }

  ngOnInit(): void {
    // get all body parts and location 
    console.log(this.bodyParts);
  }

  selectBodyPart(part) {
    // check if the body part symptoms are not loaded 


    part.symptoms.forEach((symptom) => {
      let allReadySelected = this.selectedSymptoms.find((value) => value.id == symptom.id) 
      
      if (allReadySelected) 
        symptom.selected = true ; 
      else 
      symptom.selected = false ; 
       
    }) 

  

    // if the selected part is not null and the part is allready selected 
    // then make the selected part null to close the symptoms list of the selected part 
    // else assign the selected epart to the body part 
    if (this.selectedPart && part.id == this.selectedPart.id)
      this.selectedPart = null;
    else
      this.selectedPart = part;
  
  
    }

  selectSymptom($event, symptom) {
    // every time a symptoms selected from the body part list 
    // stop propagation so we dont close the body part list of symptoms 
    // if the symptom selected do not exists create one with true boolean value 
    // else toggle the selectetion  
    $event.stopPropagation();
    if (symptom.selected === null) {
      symptom.selected = true;
      // add the symptom to the selected symptoms list  
      this.selectedSymptoms.splice(0, 0, symptom);
    } else {
      symptom.selected = !symptom.selected;
      if (symptom.selected)
        this.selectedSymptoms.splice(0, 0, symptom);
      else {
        // find the index of the symptom in the selected symptoms list 
        // and delete it  
        var index = this.selectedSymptoms.findIndex((value) => value.id == symptom.id)
        this.selectedSymptoms.splice(index, 1);
      }
    }
    this.symptomsUpdated.emit();
  }
}

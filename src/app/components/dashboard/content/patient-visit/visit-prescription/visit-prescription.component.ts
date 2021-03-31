import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-prescription',
  templateUrl: './visit-prescription.component.html',
  styleUrls: ['./visit-prescription.component.css']
})
export class VisitPrescriptionComponent implements OnInit {
  public navigationOption : number = 1 ; 
  @Input() visit : Visit  ; 
  constructor(private interactionService : InteractionService) { }

  ngOnInit(): void {
  
  }

  public use($event) { 
    this.navigationOption = 1 ; 
    this.visit.visitDrugDosages = $event.drugDosages ; 
    this.interactionService.visitEdited.next() ; 
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-information',
  templateUrl: './visit-information.component.html',
  styleUrls: ['./visit-information.component.css']
})
export class VisitInformationComponent implements OnInit {
  @Input() visit: Visit;
  constructor(private apollo: Apollo, private interactionService: InteractionService) { }

  ngOnInit(): void {
    
    this.interactionService.vitalSettingEdited.subscribe((data) => {
      this.visit.vitalSetting = data;
    })
  }

}

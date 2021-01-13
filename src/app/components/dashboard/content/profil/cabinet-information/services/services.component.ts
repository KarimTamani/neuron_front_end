import { Component, OnInit, Input } from '@angular/core';
import { Service } from 'src/app/classes/Service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  @Input() services : Service[] = [] ; 
  constructor(private interactionService : InteractionService) { }

  ngOnInit(): void {
    this.interactionService.updateService.subscribe((services) => {
      
      this.services = services ; 
    })
  }

  public getServicesJSON() { 
    return JSON.stringify(this.services) ; 
  }

}

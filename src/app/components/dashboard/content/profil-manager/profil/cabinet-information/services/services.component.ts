import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/classes/Service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  @Input() services : Service[] = [] ; 
  constructor(private interactionService : InteractionService , private router : Router) { }

  ngOnInit(): void {
    this.interactionService.updateService.subscribe((services) => {
      this.services = services ; 
    })
  }

  public openServicesEditor() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "service-submitter" , 
        "title" : "Gestion des services du Cabinet" ,  
        "services" : encodeURIComponent(JSON.stringify(this.services))   
      }
    }) ; 
  }
  get frServices () { 
    return this.services.filter(value => value.language == "FR") ; 
  }
  get arServices() { 
    return this.services.filter(value => value.language == "AR") ; 
  }
}


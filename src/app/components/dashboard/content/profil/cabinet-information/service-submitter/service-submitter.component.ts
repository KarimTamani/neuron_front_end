import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/classes/Service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-service-submitter',
  templateUrl: './service-submitter.component.html',
  styleUrls: ['./service-submitter.component.css']
})
export class ServiceSubmitterComponent implements OnInit {
  // init service for search and submitting 
  // init services that contains all the services of the medical office
  public service: Service = null;
  public services: Service[] = [];

  constructor(private apollo: Apollo , private route : ActivatedRoute, private interactionService: InteractionService) {
    this.service = new Service();
  }

  ngOnInit(): void {
    // subscribe to the query params to get the init  services from the params 
    this.route.queryParams.subscribe((params) => {
      const services = params.services ; 
      if (services) { 
        this.services = JSON.parse(services) ; 
      }
    })
  }




  public deleteService(service) { 
    
    let index = this.services.findIndex(value => value.id == service.id) ; 
    this.services.splice(index , 1) ; 
    this.interactionService.updateService.next(this.services) ; 
  }



  public submit() {
    // check if the service name at least exists 
    if (this.service.name.trim().length == 0)
      return;
    if (this.service.id == null) {
      // check if it's new service 
      // if so submitted to the apollo server 
      // and get the response and add it to the services array 
      this.apollo.mutate({
        mutation: gql`
          mutation {
            addService(service : { 
              name : "${this.service.name.trim()}" , 
              language : "${this.service.language}"
            }) { id name language }
          }`
      }).pipe(map(value => (<any>value.data).addService)).subscribe((data) => {
        // and the new subitted service to the office services  
        this.addService(data);
        this.interactionService.updateService.next(this.services) ;
      })
    } else {
      // in this case the service has been submited by search 
      // we don't need to post it to the apollo server
      this.addService(this.service);
      this.interactionService.updateService.next(this.services);
    }

  }

  private addService(service) {
    this.services.splice(0, 0, service);
    const saveLanguage = service.language;
    this.service = new Service();
    this.service.language = saveLanguage;
  }

  public toggleLanguage() {
    // toggle language between frensh and arabic 
    this.service.language = (this.service.language == "FR") ? ("AR") : ("FR");
  }
}

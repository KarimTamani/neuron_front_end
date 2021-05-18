import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-medical-file-details',
  templateUrl: './medical-file-details.component.html',
  styleUrls: ['./medical-file-details.component.css']
})
export class MedicalFileDetailsComponent implements OnInit {
  public medicalFile: MedicalFile;
  @Output() closeEvent: EventEmitter<null>;
  public inVisit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private dataService: DataService,
    private router: Router,
    private interactionService: InteractionService) {
    this.closeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams;

    var medicalFileId = params["medical-file-id"];
    var currentDate = null;

    if (params["in-visit"] == "true") {
      this.inVisit = true;

      if (params["current-date"]) {
        currentDate = new Date(params["current-date"]);
      }

    }

    this.apollo.query({
      query: gql`
        {
          getMedicalFile(medicalFileId : ${medicalFileId}) { 
            id 
            lastname 
            name 
            birthday 
            gender 
            createdAt 
            updatedAt 
            phone 
            email 
            profession {
              id name
            }
            address {
              id address commune { id name wilaya { id name }}
            }
            antecedents {
              id name type
            }
            visits {
              id createdAt symptoms {
                id name 
              }
            }
          }
        }`
    }).pipe(map(value => (<any>value.data).getMedicalFile)).subscribe((data) => {
      this.medicalFile = data;
      if (currentDate) { 
        var index = this.medicalFile.visits.findIndex(
          value => this.dataService.castDateMDY(new Date(parseInt(value.createdAt))) == this.dataService.castDateMDY(new Date(currentDate))
        ) ;  

        this.medicalFile.visits.splice(index , 1) ; 
      }


      this.medicalFile.createdAt = this.dataService.castFRDate(new Date(parseInt(this.medicalFile.createdAt)))
      this.medicalFile.updatedAt = this.dataService.castFRDate(new Date(parseInt(this.medicalFile.updatedAt)))
      for (let index = 0; index < this.medicalFile.visits.length; index++) {
        this.medicalFile.visits[index].createdAt = this.dataService.castFRDate(new Date(parseInt(this.medicalFile.visits[index].createdAt)))
      }
    })
  }

  public openVisit(visit) {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "visit-details",
        "visit-id": visit.id,
        "title": "Details de visite",
        "referer": this.router.url
      }
    })
  }

  public edit() {
    // open medical file submitter 
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "medical-file-submitter",
        "title": "Mpdification du dossie medical",
        "referer": this.router.url,
        "medical-file": encodeURIComponent(JSON.stringify(this.medicalFile))
      }
    })
  }

  public delete() {
    // open yes or no message to confirm 
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "yes-no-message",
        "title": "Suprission du dossie medical",
        "referer": this.router.url,
        "message": "Si vous suprimer le dossie medical de " + this.medicalFile.lastname + " " + this.medicalFile.name + " tout les donnes et les visites seront suprimer"
      }
    })


    const subs = this.interactionService.yesOrNo.subscribe((response) => {
      if (response) {
        this.apollo.mutate({
          mutation: gql`
          
            mutation { 
              removeMedicalFile(medicalFileId : ${this.medicalFile.id}) 
            }
          `
        }).pipe(map(value => (<any>value.data).removeMedicalFile)).subscribe(() => {
          this.interactionService.medicalFileDeleted.next(this.medicalFile);
          this.router.navigate(["/dashboard/medical-files"]);
        })
      }

      subs.unsubscribe();

    })
  }


}

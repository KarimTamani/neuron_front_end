import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-medical-file-details',
  templateUrl: './medical-file-details.component.html',
  styleUrls: ['./medical-file-details.component.css']
})
export class MedicalFileDetailsComponent implements OnInit {
  public medicalFile : MedicalFile   ; 

  constructor(
    private route : ActivatedRoute, 
    private apollo : Apollo , 
    private dataService : DataService , 
    private router  :Router) { }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams ; 

    var medicalFileId = params["medical-file-id"] ; 
    this.apollo.query({
      query:gql`
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
      this.medicalFile = data ;  
      this.medicalFile.createdAt = this.dataService.castFRDate(new Date(parseInt(this.medicalFile.createdAt)))
      this.medicalFile.updatedAt = this.dataService.castFRDate(new Date(parseInt(this.medicalFile.updatedAt)))
      for (let index = 0 ; index < this.medicalFile.visits.length ; index++) { 
          this.medicalFile.visits[index].createdAt = this.dataService.castFRDate(new Date(parseInt(this.medicalFile.visits[index].createdAt)))
      }
    })
  }

  public openVisit(visit) { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "visit-details" , 
        "visit-id"  : visit.id , 
        "title" : "Details de visite" , 
        "referer" : this.router.url  
      } 
    })
  }
}

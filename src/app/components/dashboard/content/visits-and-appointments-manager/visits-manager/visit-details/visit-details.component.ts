import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parseAndCheckHttpResponse } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {
  @Input() visitId: number;
  @Output() closeEvent: EventEmitter<null>;
  public visit: Visit;
  public totalPrice: number = 0;
  public moreDetails: boolean = false;
  public noEdit: boolean = false;
  public birthday: string;
  public age: number;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router,
    private intervationService: InteractionService,
    private dataservice: DataService) {
    this.closeEvent = new EventEmitter<null>();

  }

  ngOnInit(): void {



    this.route.queryParams.subscribe((params) => {

      if (params["more-details"] != null)
        this.moreDetails = JSON.parse(params["more-details"]);
      else
        this.moreDetails = false;
    })





    var params = this.route.snapshot.queryParams;

    console.log(params) ; 

    if (params["visit-id"])
      this.visitId = parseInt(params["visit-id"]);

    this.apollo.query({
      query: gql`
          { 
            getVisit(visitId : ${this.visitId}) { 
              id
              waitingRoom {
                id
                date
              }
              appointment { 
                id date time 
              }
              waitingRoomId 
              arrivalTime
              status
              startTime 
              endTime 
              clinicalExam
              order 
              payedMoney 
              createdAt 
              updatedAt
              condition {
                id name
              }
              debt 
              medicalActs {
                id name price 
              }
              symptoms {
                id name bodyPartId
              }
              checkUps { id name checkUpTypeId }
              certificats { id html certificatModel { id type title}}
              vitalSetting { 
                temperature 
                respiratoryRate  
                cardiacFrequency 
                bloodPressure 
                diuresis 
                weight  
                size  
                obesity 
                smoker  
              }
              visitDrugDosages {
                dosage { name } drug { name } qsp unitNumber 
              }
              medicalFile {
                id
                birthday
                name 
                lastname 
                phone
                gender
                profession { 
                  id name 
                }
                email
                address {
                  id
                  commune {
                    name 
                    wilaya {
                      id name 
                    }
                  }
                },
                antecedents { id name type}  
              }
            }
          }`
    }).pipe(map(value => (<any>value.data).getVisit)).subscribe((data) => {

      this.visit = data;
      this.birthday = this.dataservice.castFRDate(new Date(this.visit.medicalFile.birthday))
      this.age = this.dataservice.calculateAge(this.visit.medicalFile.birthday, new Date(parseInt(this.visit.createdAt)));
      if (this.visit.medicalActs)
        this.visit.medicalActs.forEach(act => {
          this.totalPrice += act.price;
        })

      if (params["no-edit"] && this.visit.status == "in visit") {
        this.noEdit = true;
      }
    })
  }


  public frDate(date : string) {
    if ( date )
     return this.dataservice.castFRDate(new Date(date)) ; 
  }

  public visitDone() {
    this.apollo.mutate({
      mutation: gql`
        mutation {
          visitDone(waitingRoomId : ${this.visit.waitingRoom.id} , visitId : ${this.visit.id}) { 
            endTime
            status
          }
        }`
    }).pipe(map(value => (<any>value.data).visitDone)).subscribe((data) => {
      this.visit.endTime = data.endTime;
      this.visit.status = data.status;
      this.intervationService.visitDone.next();
      if (this.noEdit == true)
        this.noEdit = false;

    })

  }

  public visitPaye() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "paye-visit",
        "title": "Paiement",
        "referer": this.router.url,
        "visit": encodeURIComponent(JSON.stringify(this.visit))
      }
    });
    const subs = this.intervationService.visitPayed.subscribe((data) => {
      this.visit = data;
      subs.unsubscribe();
    })
  }

  public editPayment() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "paye-visit",
        "title": "Paiement",
        "referer": this.router.url,
        "visit": encodeURIComponent(JSON.stringify(this.visit))
      }
    });
    const subs = this.intervationService.visitPayed.subscribe((data) => {
      this.visit = data;
      subs.unsubscribe();
    })
  };

  public openMoreDetails() {


    this.router.navigate([], {
      queryParams: {

        "pop-up-window": true,
        "window-page": "visit-details",
        "title": "détails de la visite",
        "referer": this.router.url,
        "visit-id": this.visit.id,
        "more-details": true
      }
    })
  }

  public back() {
    var params = this.route.snapshot.queryParams;
    var referer = params["referer"];
    this.router.navigateByUrl(referer);
  }

  public delete() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "yes-no-message",
        "title": "Suppression du visite",
        "message": "vous souhaitez supprimer la visite de " + this.visit.medicalFile.name + " " + this.visit.medicalFile.lastname + " ? ",
      }
    });
    const subs = this.intervationService.yesOrNo.subscribe((response) => {
      if (response === true) {
        this.apollo.mutate({
          mutation: gql`
            mutation { 
              removeVisit(visitId : ${this.visit.id})  
            }`
        }).pipe(map(value => (<any>value.data).removeVisit)).subscribe((data) => {
          this.intervationService.visitDeleted.next(this.visit);
          this.closeEvent.emit();
        });
      }
      subs.unsubscribe();
    })
  }

  public edit() {
    this.router.navigate([]);
    this.intervationService.openEditVisitWindow.next(this.visit);
  }

  get status() {
    if (this.visit)
      return this.dataservice.castStatusToFr(this.visit.status);
  }

}

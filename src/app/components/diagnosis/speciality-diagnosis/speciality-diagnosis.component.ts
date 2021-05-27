import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from "rxjs/operators";
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';
import { FAIL, Message } from 'src/app/classes/Message';

@Component({
  selector: 'app-speciality-diagnosis',
  templateUrl: './speciality-diagnosis.component.html',
  styleUrls: ['./speciality-diagnosis.component.css']
})
export class SpecialityDiagnosisComponent implements OnInit {

  public clearImageViewerSubject: Subject<null>
  public image: any = null;

  public selectedSpeciality: any = null;
  public specialities: any[] = [];
  public expandSpecialities: boolean = false;
  public selectedCollection: any = null;
  public showResult: boolean = false;

  public diagnosisResult: any = null;
  public visit: Visit;
  public newResult : boolean = false ; 
   
  public specialityId : number ; 
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute, 
    private router: Router , 
    private interactionService : InteractionService ) { }
  ngOnInit(): void {

    this.apollo.query({
      query: gql`{
        getAllSpecialities {
          id 
          name  
          neuronCollections {
            id 
            name
            models {
              id 
              name
            }
          }
        }
      }`
    }).pipe(map(result => (<any>result.data).getAllSpecialities)).subscribe((data) => {
      this.specialities = data;

      this.selectedSpeciality = data[0];
      
      this.specialityId = this.selectedSpeciality.id ;
      
      this.selectedCollection = this.selectedSpeciality.neuronCollections[0];

      this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
        // subscribe to the query param map chenges and extract the speciality 
        // search about it in the neuron map 
        // and aassign it to the selected Speciality
        var speciality_id = paramMap.get("speciality_id");
        var collection_id = paramMap.get("collection_id");

        if (speciality_id !== null) {
        
        
          this.selectedSpeciality = this.specialities.find((value) => value.id == speciality_id)
          if (collection_id != null) {
            this.selectedCollection = this.selectedSpeciality.neuronCollections.find((value) => value.id == collection_id);
          } else
            this.selectedCollection = this.selectedSpeciality.neuronCollections[0];
        }
      })
    })

    var params = JSON.parse(JSON.stringify(this.route.snapshot.queryParams))
    if (params["result"]) {
      this.showResult = true;
    }
    this.visit = JSON.parse(decodeURIComponent(params["visit"]));
    console.log(this.visit) ; 
  }

  public back() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "speciality-diagnosis",
        "speciality_id": this.selectedSpeciality.id,
        "title": this.selectedSpeciality.name,
        "collection_id": this.selectedCollection.id
      }
    });
    // set show result to false 
    this.showResult = false;
  }
  public onSpecialityChanged() {
    // every time a speciality changed 
    // we extract the last query params from the url
    // and update the title and set the speciality = speciality 
    // in the url params 

     
    var speciality = this.specialities.find((value) => value.id == this.specialityId) ; 

    if (this.selectedSpeciality && this.selectedSpeciality.id != speciality.id) {
      var params = JSON.parse(JSON.stringify(this.route.snapshot.queryParams))
      params.title = speciality.name;
      params.speciality_id = speciality.id;
      params.collection_id = null;
      this.router.navigate([], {
        queryParams: params
      })
      this.selectedSpeciality = speciality;
    }
    this.expandSpecialities = false;
    
  }

  public selectCollection(collection) {
    // assign collection to selected collection every time a new collection has been choosen 
    var params = JSON.parse(JSON.stringify(this.route.snapshot.queryParams))

    params.collection_id = collection.id;
    this.router.navigate([], {
      queryParams: params
    })
    this.selectedCollection = collection;



  }


  public onImageSelected(image) {
    // image selected from the image viewer components 
    // assign it to the neuron request image attribute
    this.image = image
  }

  public submit() {

    // create a formdata to upload to the server 
    // with the image file and the models we want 
    // check if the image and the models are valide 
    if (this.image == null) { 
    
      
      this.interactionService.showMessage.next(<Message>{
        message : "Image est obligatoire"  , 
        type : FAIL
      })
    
      return;

    }
    if (this.selectCollection == null)
      return;
    this.apollo.mutate({
      mutation: gql`
        mutation NeuronImageRequest($image: Upload!, $models: [String!]! ,$collectionId : ID!) {
          performNeuronImageRequest(request: {visitId : ${this.visit.id} , image: $image, models: $models , collectionId : $collectionId}) {
            original_image
            result
          }
        }
      `,
      variables: {
        image: this.image,
        models: this.selectedCollection.models.map(model => model.name),
        collectionId: this.selectedCollection.id
      },
      context: {
        useMultipart: true
      }
    }).pipe(map(result => (<any>result).data.performNeuronImageRequest)).subscribe((data) => {
      // route the query params data to add the result data 
      this.diagnosisResult = data;
      this.router.navigate([], {
        queryParams: {
          "pop-up-window": true,
          "window-page": "speciality-diagnosis",
          "result": encodeURIComponent(JSON.stringify(data)),
          "title": this.selectedCollection.name
        }
      });
      // set show result to true 
      this.showResult = true;
      this.newResult = true ; 
    })
  }
}

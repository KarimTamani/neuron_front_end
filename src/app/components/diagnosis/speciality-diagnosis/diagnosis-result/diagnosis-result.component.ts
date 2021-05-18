import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from "rxjs/operators";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diagnosis-result',
  templateUrl: './diagnosis-result.component.html',
  styleUrls: ['./diagnosis-result.component.css']
})
export class DiagnosisResultComponent implements OnInit, OnDestroy {

  public diagnosisResult: any = null;
  public predictions: any = null;
  public regions: any[] = [];
  public detectionModel: any = null;

  public models_map: any[] = [];
  public images: any[] = [];
  public originalImage: string = null;

  @Output() backEventListener : EventEmitter<null> ; 
  @Input() newResult : boolean = false ; 
  public subscriptions : Subscription[] = [] ;  

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.backEventListener = new EventEmitter<null>() ; 

  }

  ngOnInit(): void {

    // subscribe to the queryParamsMap and extract the result params 
    // parse it into json format
    const sub = this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      // get the diagnosis result from the query params 
      this.diagnosisResult = JSON.parse(decodeURIComponent(paramMap.get("result")))
      if (this.diagnosisResult  == null) 
        return ; 
      this.diagnosisResult.result = JSON.parse(this.diagnosisResult.result)
      // get the models map so we could know each model output 
      this.apollo.query({
        query: gql`{
          getModelsOutput {type  , output}
        }`
      }).pipe(map(result => (<any>result.data).getModelsOutput)).subscribe((data) => {

        this.models_map = data;
        // form the images for the images grid controller 
        this.images.splice(0, 0, {
          "id": "ORIGINAL",
          "image": this.diagnosisResult.original_image
        })

        this.originalImage = this.diagnosisResult.original_image

        this.diagnosisResult.result.forEach((model) => {

          // loop over model outputs and test if the model output is an image 
          if (this.isOutputImage(model)) {
            this.images.splice(this.images.length, 0, {
              "id": model.id,
              "image": model.output.image
            })
          }

          // if the predictions is an regions for the image 
          if (this.isOutputsRegions(model)) {
            this.detectionModel = model;
            this.images.splice(this.images.length, 0, {
              "id": model.id,
              "image": this.diagnosisResult.original_image,
              "detection": true, // set the image as a detection to draw a canvas in the html , 
              "width": model.width,
              "height": model.height
            })
          }
        })
        this.extractPredictions()
      })
    })
    this.subscriptions.push(sub) ; 
  }

  private extractPredictions() {
    // parcour the result and extract the prediction 
    this.diagnosisResult.result.forEach((model_output) => {
      if ((<string>model_output.type).endsWith("CLASSIFIER")) {
        this.predictions = model_output.output.predictions
      }
    })
  }
  
  public back() {
    this.backEventListener.emit()
  }
  
  private isOutputImage(model_prediction) {

    var model_type = model_prediction.type;
    let model_output = this.models_map.find((model_map) => model_map.type == model_type)
    if (model_output == null)
      return false;
    else {
      let image_output = model_output.output.find((output) => output == "IMAGE")
      return image_output != null
    }
  }

  private isOutputsRegions(model_prediction) {
    var model_type = model_prediction.type;
    let model_output = this.models_map.find((model_map) => model_map.type == model_type)
    if (model_output == null)
      return false;
    else {
      let image_output = model_output.output.find((output) => output == "REGIONS")
      return image_output != null
    }
  }
  public ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe() ; 
    })
  }
}

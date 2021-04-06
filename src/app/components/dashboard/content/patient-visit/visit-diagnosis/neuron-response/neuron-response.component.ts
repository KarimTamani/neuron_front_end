import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NeuronResponse } from 'src/app/classes/NeuronResponse';

@Component({
  selector: 'app-neuron-response',
  templateUrl: './neuron-response.component.html',
  styleUrls: ['./neuron-response.component.css']
})
export class NeuronResponseComponent implements OnInit {
  @Input() neuronResponse: NeuronResponse;
  @Input() modelOutputs: any;
  @Input() patientInfo : boolean = false ;
  @Input() referer : boolean = false ; 

  public topPredictions: any[] = [];
  public detection: boolean = false;
  public symptoms : string[] = [] ; 

  constructor(private router : Router) { }

  ngOnInit(): void {

    const diagnosisResult = JSON.parse(this.neuronResponse.neuronPrediction);
    
    var predictions;
    diagnosisResult.forEach((model_output) => {
      if ((<string>model_output.type).endsWith("CLASSIFIER")) {
        predictions = model_output.output.predictions
      }
      if (this.isOutputsRegions(model_output))
        this.detection = true;
    });
    if (!this.detection) {
      let keys = Object.keys(predictions)
      let values = Object.values(predictions)

      for (let index = 0; index < Math.min(keys.length, 2); index++) {

        this.topPredictions.push({
          "name": keys[index],
          "propa": values[index]
        })
      };
    }

    if (this.neuronResponse.type == "text") { 
      this.symptoms = this.neuronResponse.input.split(",") ; 
    }

  }
  private isOutputsRegions(model_prediction) {
    var model_type = model_prediction.type;
    let model_output = this.modelOutputs.find((model_map) => model_map.type == model_type)
    if (model_output == null)
      return false;
    else {
      let image_output = model_output.output.find((output) => output == "REGIONS")
      return image_output != null
    }
  }

  public openResult() { 
    var referer = "" ; 

    if (this.referer) 
      referer = this.router.url ; 
    if (this.neuronResponse.type == "image") { 
      this.router.navigate([], {
        queryParams: {
          "pop-up-window": true,
          "window-page": "speciality-diagnosis",
          "result": encodeURIComponent(JSON.stringify({
            original_image : this.neuronResponse.input , 
            result : this.neuronResponse.neuronPrediction 
          })),
          "title": this.neuronResponse.neuronCollection.name, 
          "visit" : decodeURIComponent(JSON.stringify(this.neuronResponse.visit)) ,  
          "referer" : referer
        }
      });
    }else { 
      this.router.navigate([], {
        queryParams: {
          "pop-up-window": true,
          "window-page": "diagnosis",
          "result": decodeURIComponent(this.neuronResponse.neuronPrediction) , 
          "symptoms" : decodeURIComponent(this.neuronResponse.input) , 
          "title": "Diagnositiuqe symptomsique", 
          "visit" : decodeURIComponent(JSON.stringify(this.neuronResponse.visit)) , 
          "referer" : referer 
        }
      });
    }
  }
}

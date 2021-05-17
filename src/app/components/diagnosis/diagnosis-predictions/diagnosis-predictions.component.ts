import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diagnosis-predictions',
  templateUrl: './diagnosis-predictions.component.html',
  styleUrls: ['./diagnosis-predictions.component.css']
})
export class DiagnosisPredictionsComponent implements OnInit {
  @Input() diagnosisPredictions: any = null
  public predictions: any[] = [] ; 

  constructor() { }

  ngOnInit(): void {


    let keys = Object.keys(this.diagnosisPredictions)
    let values = Object.values(this.diagnosisPredictions)

    for (let index = 0; index < keys.length; index++) {

      this.predictions.push({
        "name": keys[index],
        "propa": values[index]
      })
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-human-body',
  templateUrl: './human-body.component.html',
  styleUrls: ['./human-body.component.css']
})
export class HumanBodyComponent implements OnInit {
  @Input() gender: boolean = true
  @Input() bodyAreaSymptoms : any = null  
  
  constructor() { }

  ngOnInit(): void {

  }

  getImageSource() {
    // get the body image source based on the selected symptoms 
    // and the gender
    let image_name = (this.gender) ? ('m') : ('f');
    if (this.bodyAreaSymptoms.head.length)
      image_name += "_head";

    if (this.bodyAreaSymptoms.chest.length)
      image_name += "_chest";

    if (this.bodyAreaSymptoms.abdomin.length)
      image_name += "_abdomin";

    if (this.bodyAreaSymptoms.arms.length)
      image_name += "_arms";

    if (this.bodyAreaSymptoms.legs.length)
      image_name += "_legs";

    return `../../../../assets/${(this.gender) ? ('male') : ('female')}_model/${image_name}.png`
  }
  
}

import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-evolution-cart',
  templateUrl: './evolution-cart.component.html',
  styleUrls: ['./evolution-cart.component.css']
})
export class EvolutionCartComponent implements OnInit {
  @Input() evolutionParam : any ; 
  public classStyle : any ; 
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.classStyle = {
      backgroundColor : this.evolutionParam.backgroundColor , 
      boxShadow : this.evolutionParam.boxShadow 
    }
  }

  get getPercentage() { 
    return Math.round(this.evolutionParam.evolutionPercentage * 100) / 100 ; 
  }

  get periodText() { 
    return this.dataService.periodToText(this.evolutionParam.period) ; 
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-evolution-cart',
  templateUrl: './evolution-cart.component.html',
  styleUrls: ['./evolution-cart.component.css']
})
export class EvolutionCartComponent implements OnInit {
  @Input() evolutionParam : any ; 
  public classStyle : any ; 
  constructor() { }

  ngOnInit(): void {
    this.classStyle = {
      backgroundColor : this.evolutionParam.backgroundColor , 
      boxShadow : this.evolutionParam.boxShadow 
    }

  }

}

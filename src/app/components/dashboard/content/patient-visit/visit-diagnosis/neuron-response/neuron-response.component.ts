import { Component, Input, OnInit } from '@angular/core';
import { NeuronResponse } from 'src/app/classes/NeuronResponse';

@Component({
  selector: 'app-neuron-response',
  templateUrl: './neuron-response.component.html',
  styleUrls: ['./neuron-response.component.css']
})
export class NeuronResponseComponent implements OnInit {
  @Input() neuronResponse : NeuronResponse; 
  constructor() { }

  ngOnInit(): void {
  }

}

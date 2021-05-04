import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-evolution-analytics',
  templateUrl: './evolution-analytics.component.html',
  styleUrls: ['./evolution-analytics.component.css']
})
export class EvolutionAnalyticsComponent implements OnInit {
  @Input() analytics : any ;  
  @Input() period : number ;
  @Input() updateSubject : Subject<any> ;  
  public evolutionParams : any[] = [
    {
      icon : "fa fa-calendar-check" ,
      name : "Visites" , 
      period : null  ,
      backgroundColor : "#FE6555" , 
      evolutionPercentage : null , 
      evolutionValue : null ,
      boxShadow : "0px 0px 26px #FE655566" 
    } , 
    {
      icon : "fa fa-coins" ,
      name : "Gain" , 
      period : null  ,
      backgroundColor : "#265ED7" , 
      evolutionPercentage : null , 
      evolutionValue : null  , 
      boxShadow : "0px 0px 26px #265ED766" 
    } , 
    {
      icon : "fa fa-user-injured" ,
      name : "Patients" , 
      period : null   ,
      backgroundColor : "white" , 
      evolutionPercentage : null , 
      evolutionValue : null  , 
      boxShadow : "0px 0px 26px #00000011" ,  
      white : true 
    } 
  ] ; 
  constructor() { }

  ngOnInit(): void { 
    this.loadAnalytics() ; 

    if (this.updateSubject) { 
      this.updateSubject.subscribe((data) => { 
        this.analytics = data.analytics ; 
        this.period = data.period ; 
        this.loadAnalytics() ;     
      })
    }
  }


  private loadAnalytics() { 
    this.evolutionParams[0].evolutionValue = this.analytics.getVisitsEvolution.value 
    
    this.evolutionParams[0].evolutionPercentage  = this.analytics.getVisitsEvolution.percentage 

    this.evolutionParams[1].evolutionValue  = this.analytics.getGainEvolution.value 
    this.evolutionParams[1].evolutionPercentage  = this.analytics.getGainEvolution.percentage

    this.evolutionParams[2].evolutionValue  = this.analytics.getPatientsEvolution.value 
    this.evolutionParams[2].evolutionPercentage  = this.analytics.getPatientsEvolution.percentage
  
    if (this.evolutionParams[0].evolutionValue > 0){
      this.evolutionParams[0].evolutionValue = "+" +  this.evolutionParams[0].evolutionValue ; 
    }
    if (this.evolutionParams[1].evolutionValue > 0){
      this.evolutionParams[1].evolutionValue = "+" +  this.evolutionParams[1].evolutionValue ; 
    }
    if (this.evolutionParams[2].evolutionValue > 0){
      this.evolutionParams[2].evolutionValue = "+" +  this.evolutionParams[2].evolutionValue ; 
    }
    this.evolutionParams[0].evolutionValue = this.evolutionParams[0].evolutionValue + " Visite"
    this.evolutionParams[1].evolutionValue = this.evolutionParams[1].evolutionValue + " DA"
    this.evolutionParams[2].evolutionValue = this.evolutionParams[2].evolutionValue + " Patient"
 
    this.evolutionParams[0].evolutionPercentage = this.evolutionParams[0].evolutionPercentage * 100 
    this.evolutionParams[1].evolutionPercentage = this.evolutionParams[1].evolutionPercentage * 100 
    this.evolutionParams[2].evolutionPercentage = this.evolutionParams[2].evolutionPercentage * 100 
    
    this.evolutionParams[0].period = this.period ; 
    this.evolutionParams[1].period = this.period ; 
    this.evolutionParams[2].period = this.period ; 

  }
}

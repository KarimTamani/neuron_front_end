import { CheckUpType } from "./CheckUpType";

export class CheckUp { 
    public id : number ; 
    public name : string ; 
    public checkUpType : CheckUpType ;
    
    public constructor() { 
        this.checkUpType = new CheckUpType()  ;
    }

}
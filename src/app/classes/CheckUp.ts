import { CheckUpType } from "./CheckUpType";

export class CheckUp { 
    public id : number ; 
    public name : string ; 

    public checkUpTypeId : number ; 
    public checkUpType : CheckUpType ;
    public isPublic : boolean ; 
    
    public constructor() { 
        this.checkUpType = new CheckUpType()  ;
    }

}
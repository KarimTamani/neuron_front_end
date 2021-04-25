import { CheckUp } from "./CheckUp";

export class CheckUpType { 
    public id : number ; 
    public name : string ; 
    public checkUps : CheckUp[] = [] ;  
    public isPublic : boolean ; 
}
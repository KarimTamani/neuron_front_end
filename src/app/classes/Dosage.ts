import { Drug } from "./Drug";

export class Dosage { 
    public id : number ; 
    public name : string ; 
    public drugs : Drug[] ; 

    public constructor() { 
        this.drugs = [] ; 
    }
}
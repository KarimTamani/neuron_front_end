import { Dosage } from "./Dosage";

export class Drug { 
    public id : number ; 
    public name : string ; 
    public dosages : Dosage[] ; 
    public constructor() {
        this.dosages = [] ; 
    }
}
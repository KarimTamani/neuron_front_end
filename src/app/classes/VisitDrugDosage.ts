import { Dosage } from "./Dosage";
import { Drug } from "./Drug";

export class VisitDrugDosage {
    public id : number ; 
    public drug : Drug ; 
    public dosage : Dosage ; 
    public qsp : string ; 
    public unitNumber : number ; 
    public constructor() {
        this.drug = new Drug() ; 
        this.dosage = new Dosage() ; 
    }
}



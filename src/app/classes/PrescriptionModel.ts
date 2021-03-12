import { VisitDrugDosage } from "./VisitDrugDosage";

export class PrescriptionModel { 
    public id : number ; 
    public name : string ;
    public drudDosages: VisitDrugDosage[] = [] ;  
}
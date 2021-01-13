import { Wilaya } from "./Wilaya";

export class Commune {
    public id : number ; 
    public postalCode : string ; 
    public name : string ; 
    public wilaya : Wilaya ; 

    public constructor() {
        this.wilaya = new Wilaya() ; 
    }
    
}
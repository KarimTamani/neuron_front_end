import { Address } from "./Address";
import { Service } from './Service';

export class Cabinet { 
    
    public id : number ; 
    public name : string ; 
    public header : string ; 
    public headerAr : string ; 
    public email : string ; 
    public phone : string ; 
    public address : Address ; 
    public services : Service[] = []; 
    public constructor() {
        this.address =  new Address()  ; 
    }
}
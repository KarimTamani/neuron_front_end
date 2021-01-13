import { Commune } from "./Commune";

export class Address { 
    public id : number ; 
    public address : string ; 
    public commune : Commune ;

    public constructor() {
        this.commune = new Commune() ; 
    }
}
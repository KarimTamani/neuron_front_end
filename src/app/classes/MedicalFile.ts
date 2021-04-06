
import { Antecedent } from "./Antecedent";
import { Profession } from "./Profession";
import { Address } from './Address';
import { Visit } from "./Visit";
export class MedicalFile {

    public id: number;
    public name: string;
    public lastname: string;
    public address: Address
    public phone: string;
    public email: string;
    public birthday: string;
    public gender: Boolean = true;
    public createdAt: string;
    public updatedAt: string;
    public antecedents: Antecedent[] = [];
    public profession: Profession;
    public visits : Visit[] = [] ; 

    public constructor () {
        this.address = new Address() ; 
        this.profession = new Profession() ; 
    }
}
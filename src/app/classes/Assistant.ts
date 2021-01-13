export class Assistant { 
    public id : number ; 
    public name : String ; 
    public lastname : string ; 
    public phone : string ; 
    public gender : boolean ; 
    public email : string ; 
    public password : string ; 
    public passwordConfirm : string ; 

    public constructor() {
        this.gender = true ; 
    }
}
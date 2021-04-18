export const ALWAYS: number = 1;
export const ONCE: number = 2;
export const RANDOM: number = 3;


export class VAResponse {

    public message: string;
    public speakable: number = ALWAYS;
}

export class YesNoVAResponse extends VAResponse {
    public yesNo:boolean = true ; 
    public command: string;
}
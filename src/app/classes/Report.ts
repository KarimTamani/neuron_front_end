export class Report {
    public count: number;
    public startTime: string;
    public endTime: string;
    public period: string;
    public name: string;
    public lastname: string;
    public money: number;
    public debt: number;

    public constructor() {
        this.count = 0;
        this.money = 0;
        this.debt = 0;
    }
}


export class WaitingRoomReport {
    public waiting: Report;
    public done: Report;
    public ignored: Report;
    public inVisit: Report;

    public constructor() {
        this.waiting = new Report();
        this.done = new Report();
        this.ignored = new Report();
        this.inVisit = new Report();
    }
}
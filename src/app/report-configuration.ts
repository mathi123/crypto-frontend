export class ReportConfiguration{
    public startDate: Date;
    public endDate: Date;

    constructor(){
        this.endDate = new Date(Date.now());
    }
}
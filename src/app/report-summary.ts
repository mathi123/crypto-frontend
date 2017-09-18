export class ReportSummary{
    public startValue: number = 0;
    public endValue: number = 0;
    public buyIn: number = 0;
    public buyOut: number = 0;

    public total: number = 0;

    public recalculateTotal(){
        this.total = this.endValue - this.startValue - this.buyIn + this.buyOut;
    }
}
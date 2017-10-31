import { Statistic } from "./statistic";

export class JobStatistic{
    public done: Statistic = new Statistic();
    public failed: Statistic = new Statistic();
}
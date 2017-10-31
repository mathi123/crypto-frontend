import { Statistic } from "./statistic";
import { JobStatistic } from "./job-statistic";
import { EthereumStatistic } from "./ethereum-statistic";

export class AdminStatistics{
    public user: Statistic = new Statistic();
    public log: Statistic = new Statistic();
    public job: JobStatistic = new JobStatistic();
    public ethereum: EthereumStatistic = new EthereumStatistic();
}
import { Statistic } from "./statistic";
import { EthereumStatistic } from "./ethereum-statistic";

export class AdminStatistics{
    public user: Statistic = new Statistic();
    public log: Statistic = new Statistic();
    public ethereum: EthereumStatistic = new EthereumStatistic();
}
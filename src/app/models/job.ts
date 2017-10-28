export class Job{
    id: string;
    name: string;
    args: string;
    startTime: Date;
    endTime: Date;
    progress: number;
    createdAt: Date;
    state: string;
}
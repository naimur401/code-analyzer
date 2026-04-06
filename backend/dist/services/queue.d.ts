import Queue from 'bull';
export interface AnalysisJob {
    userId: string;
    repositoryId: string;
    owner: string;
    repo: string;
}
export interface SecurityScanJob {
    userId: string;
    repositoryId: string;
    owner: string;
    repo: string;
}
export interface ComparisonJob {
    userId: string;
    repo1Id: string;
    repo2Id: string;
    owner1: string;
    owner2: string;
    repo1Name: string;
    repo2Name: string;
}
export declare const analysisQueue: Queue.Queue<AnalysisJob>;
export declare const securityQueue: Queue.Queue<SecurityScanJob>;
export declare const comparisonQueue: Queue.Queue<ComparisonJob>;
export declare function addAnalysisJob(data: AnalysisJob): Promise<Queue.Job<AnalysisJob>>;
export declare function addSecurityScanJob(data: SecurityScanJob): Promise<Queue.Job<SecurityScanJob>>;
export declare function addComparisonJob(data: ComparisonJob): Promise<Queue.Job<ComparisonJob>>;
export declare function getJobStatus(queue: Queue.Queue<any>, jobId: string): Promise<{
    id: Queue.JobId;
    progress: any;
    data: any;
    state: Queue.JobStatus | "stuck";
    attempts: number;
    failedReason: string | undefined;
} | null>;
declare const _default: {
    analysisQueue: Queue.Queue<AnalysisJob>;
    securityQueue: Queue.Queue<SecurityScanJob>;
    comparisonQueue: Queue.Queue<ComparisonJob>;
    addAnalysisJob: typeof addAnalysisJob;
    addSecurityScanJob: typeof addSecurityScanJob;
    addComparisonJob: typeof addComparisonJob;
    getJobStatus: typeof getJobStatus;
};
export default _default;
//# sourceMappingURL=queue.d.ts.map
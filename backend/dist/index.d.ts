import 'express-async-errors';
export declare function broadcastJobProgress(jobId: string, progress: number, analysisId?: string): void;
export declare function broadcastJobCompleted(jobId: string, result: any, analysisId?: string): void;
export declare function broadcastJobFailed(jobId: string, error: string, analysisId?: string): void;
//# sourceMappingURL=index.d.ts.map
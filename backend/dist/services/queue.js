import Queue from 'bull';
// Parse Redis URL or use default
const getRedisConfig = () => {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
        const url = new URL(redisUrl);
        return {
            host: url.hostname,
            port: parseInt(url.port || '6379'),
            password: url.password || undefined,
        };
    }
    catch {
        return {
            host: 'localhost',
            port: 6379,
        };
    }
};
const redisConfig = getRedisConfig();
// Create queues
export const analysisQueue = new Queue('code-analysis', {
    redis: redisConfig,
    settings: {
        maxStalledCount: 2,
        lockDuration: 30000,
        lockRenewTime: 15000,
    },
});
export const securityQueue = new Queue('security-scan', {
    redis: redisConfig,
    settings: {
        maxStalledCount: 2,
        lockDuration: 30000,
        lockRenewTime: 15000,
    },
});
export const comparisonQueue = new Queue('comparison', {
    redis: redisConfig,
    settings: {
        maxStalledCount: 2,
        lockDuration: 30000,
        lockRenewTime: 15000,
    },
});
// Queue event handlers
analysisQueue.on('completed', (job) => {
    console.log(`Analysis job ${job.id} completed`);
});
analysisQueue.on('failed', (job, err) => {
    console.error(`Analysis job ${job.id} failed:`, err.message);
});
securityQueue.on('completed', (job) => {
    console.log(`Security scan job ${job.id} completed`);
});
securityQueue.on('failed', (job, err) => {
    console.error(`Security scan job ${job.id} failed:`, err.message);
});
comparisonQueue.on('completed', (job) => {
    console.log(`Comparison job ${job.id} completed`);
});
comparisonQueue.on('failed', (job, err) => {
    console.error(`Comparison job ${job.id} failed:`, err.message);
});
// Helper to add jobs to queue
export async function addAnalysisJob(data) {
    const job = await analysisQueue.add(data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: true,
    });
    return job;
}
export async function addSecurityScanJob(data) {
    const job = await securityQueue.add(data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: true,
    });
    return job;
}
export async function addComparisonJob(data) {
    const job = await comparisonQueue.add(data, {
        attempts: 2,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: true,
    });
    return job;
}
export async function getJobStatus(queue, jobId) {
    const job = await queue.getJob(jobId);
    if (!job)
        return null;
    return {
        id: job.id,
        progress: job.progress(),
        data: job.data,
        state: await job.getState(),
        attempts: job.attemptsMade,
        failedReason: job.failedReason,
    };
}
export default {
    analysisQueue,
    securityQueue,
    comparisonQueue,
    addAnalysisJob,
    addSecurityScanJob,
    addComparisonJob,
    getJobStatus,
};
//# sourceMappingURL=queue.js.map
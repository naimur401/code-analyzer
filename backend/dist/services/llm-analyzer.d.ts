export interface AnalysisResult {
    overallScore: number;
    complexity: {
        average: number;
        high: number;
        critical: number;
    };
    maintainability: number;
    testCoverage: number;
    documentation: {
        score: number;
        missingDocs: number;
    };
    insights: string[];
    recommendations: string[];
}
export declare function analyzeCodeWithLLM(data: {
    repositoryName: string;
    owner: string;
    languages: Record<string, number>;
    structure: any;
}): Promise<AnalysisResult>;
export declare function scanSecurityWithLLM(data: {
    repositoryName: string;
    owner: string;
    files: string[];
}): Promise<{
    vulnerabilities: any[];
    recommendations: string[];
}>;
//# sourceMappingURL=llm-analyzer.d.ts.map
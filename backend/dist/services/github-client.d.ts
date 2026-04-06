export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
    };
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
}
export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    email: string;
}
export declare class GitHubClient {
    private client;
    constructor(accessToken: string);
    getUser(): Promise<GitHubUser>;
    getUserRepositories(page?: number, perPage?: number): Promise<GitHubRepository[]>;
    getRepositoryContent(owner: string, repo: string, path?: string): Promise<any>;
    getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>>;
    getRepository(owner: string, repo: string): Promise<GitHubRepository>;
    listPullRequests(owner: string, repo: string, state?: string): Promise<any[]>;
    listIssues(owner: string, repo: string, state?: string): Promise<any[]>;
    listCommits(owner: string, repo: string, perPage?: number): Promise<any[]>;
    createWebhook(owner: string, repo: string, callbackUrl: string): Promise<any>;
}
export declare function exchangeCodeForToken(code: string): Promise<string>;
//# sourceMappingURL=github-client.d.ts.map
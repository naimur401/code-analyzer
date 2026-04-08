import axios from 'axios';
export class GitHubClient {
    constructor(accessToken) {
        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
    }
    async getUser() {
        const { data } = await this.client.get('/user');
        return data;
    }
    async getUserRepositories(page = 1, perPage = 30) {
        const { data } = await this.client.get('/user/repos', {
            params: {
                page,
                per_page: perPage,
                sort: 'updated',
                direction: 'desc',
            },
        });
        return data;
    }
    async getRepositoryContent(owner, repo, path = '') {
        try {
            const { data } = await this.client.get(`/repos/${owner}/${repo}/contents${path ? '/' + path : ''}`);
            return data;
        }
        catch (error) {
            return null;
        }
    }
    async getRepositoryLanguages(owner, repo) {
        const { data } = await this.client.get(`/repos/${owner}/${repo}/languages`);
        return data;
    }
    async getRepository(owner, repo) {
        const { data } = await this.client.get(`/repos/${owner}/${repo}`);
        return data;
    }
    async listPullRequests(owner, repo, state = 'all') {
        const { data } = await this.client.get(`/repos/${owner}/${repo}/pulls`, { params: { state, per_page: 50 } });
        return data;
    }
    async listIssues(owner, repo, state = 'all') {
        const { data } = await this.client.get(`/repos/${owner}/${repo}/issues`, { params: { state, per_page: 50 } });
        return data;
    }
    async listCommits(owner, repo, perPage = 50) {
        const { data } = await this.client.get(`/repos/${owner}/${repo}/commits`, { params: { per_page: perPage } });
        return data;
    }
    async createWebhook(owner, repo, callbackUrl) {
        const { data } = await this.client.post(`/repos/${owner}/${repo}/hooks`, {
            name: 'web',
            active: true,
            events: ['push', 'pull_request'],
            config: {
                url: callbackUrl,
                content_type: 'json',
            },
        });
        return data;
    }
}
// Static method for OAuth token exchange
export async function exchangeCodeForToken(code) {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
    }, {
        headers: { Accept: 'application/json' },
    });
    if (response.data.error) {
        throw new Error(`GitHub OAuth error: ${response.data.error}`);
    }
    return response.data.access_token;
}
//# sourceMappingURL=github-client.js.map
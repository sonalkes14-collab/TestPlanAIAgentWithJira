import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const API_HOST = "http://localhost:8000"; // Should be from env

interface Props {
    config: { url: string; user: string; token: string; projectKey: string; };
    update: (p: Partial<{ url: string; user: string; token: string; projectKey: string; }>) => void;
    setReqs: (r: unknown[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2_Jira({ config, update, setReqs, onNext, onBack }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetched, setFetched] = useState(false);



    const fetchRequirements = async () => {
        setLoading(true);
        setError('');
        try {
            // ... (existing code)
            const jql = `project = ${config.projectKey} AND issuetype in (Story, Task) ORDER BY created DESC`;
            const res = await axios.post(`${API_HOST}/api/jira/fetch_requirements?jql=${encodeURIComponent(jql)}`, {
                instance_url: config.url,
                username: config.user,
                api_token: config.token
            });

            setReqs(res.data.issues);
            setFetched(true);
        } catch (err: unknown) {
            const message = err instanceof AxiosError
                ? err.response?.data?.detail || err.message
                : (err as Error).message || 'An error occurred';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">Jira Integration</h2>
            <p className="text-gray-500">Connect to Jira to fetch user stories and requirements.</p>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jira Instance URL</label>
                    <input
                        type="text"
                        value={config.url}
                        onChange={(e) => update({ url: e.target.value })}
                        placeholder="https://your-domain.atlassian.net"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
                    <input
                        type="text"
                        value={config.user}
                        onChange={(e) => update({ user: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Token</label>
                    <input
                        type="password"
                        value={config.token}
                        onChange={(e) => update({ token: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Key</label>
                    <input
                        type="text"
                        value={config.projectKey}
                        onChange={(e) => update({ projectKey: e.target.value })}
                        placeholder="e.g. PROJ"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="flex justify-between items-center pt-4">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700">← Back</button>

                {!fetched ? (
                    <button
                        onClick={fetchRequirements}
                        disabled={loading || !config.projectKey}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Fetching...' : 'Fetch Requirements'}
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Requirements Loaded (Next) →
                    </button>
                )}
            </div>
        </div>
    );
}

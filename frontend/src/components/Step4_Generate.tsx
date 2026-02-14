import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import ReactMarkdown from 'react-markdown';
import type { WizardData } from './Wizard';

const API_HOST = "http://localhost:8000";

interface Props {
    data: WizardData;
    onBack: () => void;
}

export default function Step4_Generate({ data, onBack }: Props) {
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setGenerating(true);
        setError('');
        try {
            const payload = {
                jira_config: {
                    instance_url: data.jiraConfig.url,
                    username: data.jiraConfig.user,
                    api_token: data.jiraConfig.token
                },
                llm_config: {
                    provider: data.llmConfig.provider,
                    model: data.llmConfig.model,
                    api_key: data.llmConfig.apiKey
                },
                api_context: `Base URL: ${data.apiConfig.baseUrl}\nAuth: ${data.apiConfig.authHeader}`,
                requirements: data.requirements
            };

            const response = await axios.post(`${API_HOST}/api/generate`, payload);
            setResult(response.data.full_plan);
        } catch (err: unknown) {
            const message = err instanceof AxiosError
                ? err.response?.data?.detail || err.message
                : (err as Error).message || 'An error occurred';
            setError(message);
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const blob = new Blob([result], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TestPlan-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (result) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                            <h3 className="font-bold text-green-800">Test Plan Generated!</h3>
                            <p className="text-green-600 text-sm">Ready for review or export.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setResult(null)} className="text-gray-500 hover:text-gray-700 px-3 py-1">Restart</button>
                        <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm transition-colors text-sm">
                            Markdown ⬇️
                        </button>
                    </div>
                </div>

                {/* Secondary Exports */}
                <div className="flex justify-end gap-2 px-2">
                    <button
                        onClick={async () => {
                            // JSON Export
                            // Note: In a real app we'd construct the blob directly from `data` in memory or call the API
                            // But since we built an API endpoint, let's demo calling it:
                            try {
                                const res = await axios.post(`${API_HOST}/api/export/json`,
                                    { full_plan: { strategy: '...', test_cases: '...', full_plan: result } },
                                    { responseType: 'blob' }
                                );
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'test_plan.json');
                                document.body.appendChild(link);
                                link.click();
                            } catch (e) { console.error(e); alert('Export failed'); }
                        }}
                        className="text-gray-600 text-sm hover:text-blue-600 underline"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                // We need to pass the separated strategy/test_cases. 
                                // Since we didn't save them separately in the simple state of Step4, 
                                // we might need to refactor Step4 state to hold the object, not just the string.
                                // For now, we will alert limitation.
                                alert("Enhanced export requires full state refactor. using Markdown download for now.");
                            } catch (e) { console.error(e); }
                        }}
                        className="text-gray-600 text-sm hover:text-blue-600 underline"
                    >
                        Export Excel
                    </button>
                </div>

                <div className="prose max-w-none p-6 border rounded-xl bg-gray-50 max-h-[600px] overflow-y-auto">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            </div>
        );
    }

    return (
        <div className="text-center py-12 space-y-8 animate-fadeIn">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">Ready to Generate</h2>
                <p className="text-gray-500">We have everything needed to build your test plan.</p>
            </div>

            <div className="flex justify-center gap-8 text-left max-w-md mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                    <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Requirements</span>
                    <span className="text-2xl font-bold text-gray-700">{data.requirements.length} Stories</span>
                </div>
                <div>
                    <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">Target API</span>
                    <span className="text-2xl font-bold text-gray-700">{data.apiConfig.baseUrl ? 'Configured' : 'Missing'}</span>
                </div>
                <div>
                    <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider">AI Model</span>
                    <span className="text-2xl font-bold text-gray-700 capitalize">{data.llmConfig.provider}</span>
                </div>
            </div>

            {error && <div className="max-w-md mx-auto p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="flex justify-center gap-4">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700 px-6 py-3">← Back</button>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-blue-600 text-white px-10 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait shadow-lg hover:shadow-xl transition-all font-bold text-lg flex items-center gap-3"
                >
                    {generating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Building Plan...
                        </>
                    ) : 'Generate Test Plan 🚀'}
                </button>
            </div>
        </div>
    );
}

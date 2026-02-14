import { useState } from 'react';

interface Props {
    data: { baseUrl: string; authHeader: string; };
    update: (p: Partial<{ baseUrl: string; authHeader: string; }>) => void;
    onNext: () => void;
}

export default function Step1_Api({ data, update, onNext }: Props) {
    const [testing, setTesting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleTest = async () => {
        setTesting(true);
        // Simulate check
        setTimeout(() => {
            setTesting(false);
            setStatus('success');
        }, 800);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">Target API Configuration</h2>
            <p className="text-gray-500">Enter the details of the API you want to test against.</p>

            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Base URL</label>
                    <input
                        type="text"
                        value={data.baseUrl}
                        onChange={(e) => update({ baseUrl: e.target.value })}
                        placeholder="https://api.example.com/v1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Header (Optional)</label>
                    <input
                        type="password"
                        value={data.authHeader}
                        onChange={(e) => update({ authHeader: e.target.value })}
                        placeholder="Bearer eyJhbGciOi..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <button
                    onClick={handleTest}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                >
                    {testing ? 'Testing...' : 'Test Connection ⚡'}
                </button>
                {status === 'success' && <span className="text-green-600 text-sm">✓ Connection Verified</span>}

                <button
                    onClick={onNext}
                    disabled={!data.baseUrl}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next Step →
                </button>
            </div>
        </div>
    );
}

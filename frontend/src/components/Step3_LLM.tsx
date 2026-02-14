// import { useState } from 'react';

interface Props {
    config: { provider: string; model: string; apiKey: string; };
    update: (p: Partial<{ provider: string; model: string; apiKey: string; }>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step3_LLM({ config, update, onNext, onBack }: Props) {

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800">AI Model Configuration</h2>
            <p className="text-gray-500">Select the Brain that will generate your test plan.</p>

            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <select
                        value={config.provider}
                        onChange={(e) => update({ provider: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="openai">OpenAI (GPT-4)</option>
                        <option value="anthropic">Anthropic (Claude 3.5)</option>
                        <option value="ollama">Ollama (Local)</option>
                    </select>
                </div>

                {config.provider !== 'ollama' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                            type="password"
                            value={config.apiKey}
                            onChange={(e) => update({ apiKey: e.target.value })}
                            placeholder="sk-..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                    <input
                        type="text"
                        value={config.model}
                        onChange={(e) => update({ model: e.target.value })}
                        placeholder={config.provider === 'openai' ? 'gpt-4o' : 'llama3'}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700">← Back</button>
                <button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Review & Generate →
                </button>
            </div>
        </div>
    );
}

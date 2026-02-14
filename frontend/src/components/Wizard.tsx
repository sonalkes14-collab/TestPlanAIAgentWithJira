import { useState } from 'react';
import Step1_Api from './Step1_Api';
import Step2_Jira from './Step2_Jira';
import Step3_LLM from './Step3_LLM';
import Step4_Generate from './Step4_Generate';

export type WizardData = {
    apiConfig: { baseUrl: string; authHeader: string; };
    jiraConfig: { url: string; user: string; token: string; projectKey: string; };
    llmConfig: { provider: string; model: string; apiKey: string; };
    requirements: unknown[];
};

export default function Wizard() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>({
        apiConfig: { baseUrl: '', authHeader: '' },
        jiraConfig: { url: '', user: '', token: '', projectKey: '' },
        llmConfig: { provider: 'openai', model: 'gpt-4o', apiKey: '' },
        requirements: []
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateData = (section: keyof WizardData, payload: Partial<WizardData[keyof WizardData]>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(prev => ({ ...prev, [section]: { ...prev[section], ...(payload as any) } }));
    };

    const setReqs = (reqs: unknown[]) => {
        setData(prev => ({ ...prev, requirements: reqs }));
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 w-full max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="flex justify-between mb-8 px-10">
                {['API Setup', 'Jira Connect', 'LLM Config', 'Generate'].map((label, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > idx + 1 ? 'bg-green-500 text-white' :
                            step === idx + 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {step > idx + 1 ? '✓' : idx + 1}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step === idx + 1 ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {step === 1 && <Step1_Api data={data.apiConfig} update={(p) => updateData('apiConfig', p)} onNext={nextStep} />}
                {step === 2 && <Step2_Jira config={data.jiraConfig} update={(p) => updateData('jiraConfig', p)} setReqs={setReqs} onNext={nextStep} onBack={prevStep} />}
                {step === 3 && <Step3_LLM config={data.llmConfig} update={(p) => updateData('llmConfig', p)} onNext={nextStep} onBack={prevStep} />}
                {step === 4 && <Step4_Generate data={data} onBack={prevStep} />}
            </div>
        </div>
    );
}

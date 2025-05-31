'use client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import RequestInput from '@/components/RequestInput';
import { startProcurementSSE } from '@/lib/api/sse/startProcurementSSE';
import { getNextRequestId, PROCUREMENT_STEPS } from '@/lib/constants';
import { useState } from 'react';
import StepTabs from '@/components/StepTabs';
import StepContent from '@/components/StepContent';

export default function RequestDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [submitted, setSubmitted] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [stepDescriptions, setStepDescriptions] = useState<string[]>([]);

  const handleSubmit = async (file: File | null, prompt: string) => {
    const req_id = getNextRequestId();
    localStorage.setItem('request-id', req_id);
    setSubmitted(true);
    setWorkflowStep(1);
    setActiveTab(0);

    setTimeout(() => setWorkflowStep(2), 2000);
    setTimeout(() => setWorkflowStep(3), 4000);

    const descriptions: string[] = [];

    startProcurementSSE(prompt, (step, description, index) => {
      descriptions[index] = description;
      setStepDescriptions([...descriptions]);
      setWorkflowStep(index + 1);
    });

  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>Back</Button>
      <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-500" /> Details for {id}
      </h2>
      <div className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <p>This section will show negotiation flow and agent interactions.</p>
          <ul className="list-disc list-inside text-gray-600">
            <div className="mt-8">
              <StepTabs
                steps={PROCUREMENT_STEPS}
                activeStep={activeTab}
                workflowStep={workflowStep}
                onTabClick={setActiveTab}
              />
              <StepContent description={stepDescriptions[activeTab]} />
            </div>
            <li>Quote received and parsed</li>
            <li>Benchmarked and strategy prepared</li>
            <li>Email sent to supplier</li>
            <li>Status updated</li>
          </ul>
        </div>

        <div className="md:w-1/3">
          <RequestInput onSubmit={handleSubmit} showFileInput={false} />
        </div>
      </div>

    </div>
  );
}

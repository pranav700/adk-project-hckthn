'use client';

import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import RequestInput from '@/components/RequestInput';
import StepTabs from '@/components/StepTabs';
import StepContent from '@/components/StepContent';
import { APP_NAME, getNextRequestId, PROCUREMENT_AGENTS, PROCUREMENT_STEPS, SESSION_ID, USER_ID } from '@/lib/constants';
import { startProcurement } from '@/lib/api/sse/startProcurementSSE';
import { createSession } from '@/lib/api/rest/startSession';
import OverviewCard from '@/components/OverviewCard';
import SupplierQuoteCard from '@/components/SupplierQuoteCard';
import StrategyCard from '@/components/StrategyCard';
import EmailDraftEditor from '@/components/EmailDraftEditor';


export default function UploadPage() {
  const [submitted, setSubmitted] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [stepDescriptions, setStepDescriptions] = useState<ReactNode[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{ sessionId: string; appName: string; userId: string; } | null>(null);
  const hasInitialized = useRef(false);
  const stepComponentMap: Record<string, (props: { data: any }) => JSX.Element> = {};

  const agentToComponent = {
    doc_agent: OverviewCard,
    analysis_agent: SupplierQuoteCard,
    strategy_agent: StrategyCard,
    comms_agent: EmailDraftEditor,
  };
  PROCUREMENT_AGENTS.forEach(agent => {
    const Component = agentToComponent[agent as keyof typeof agentToComponent] || OverviewCard; // fallback component
    stepComponentMap[agent] = (props) => <Component quote={props.data} />;
  });


  useEffect(() => {


    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initSession = async () => {
      const session = await createSession(APP_NAME, USER_ID, SESSION_ID);
      setSessionInfo({
        sessionId: session.id,
        appName: session.appName,
        userId: session.userId,
      });

    }
    initSession();
  }, []);


  const handleSubmit = async (file: File | null, prompt: string) => {
    const id = getNextRequestId();
    localStorage.setItem('request-id', id);
    setSubmitted(true);
    setWorkflowStep(1);
    setActiveTab(0);

    if (file?.type.startsWith('image/') || file?.type === 'application/pdf') {
      // Handle image file upload
      const dataUrl = await readAsDataUrl(file);
      const base64Data = dataUrl.split(',')[1];
      const inlineData = { data: base64Data, mimeType: file.type };

      const descriptions: ReactNode[] = [];

      if (
        sessionInfo &&
        sessionInfo.appName &&
        sessionInfo.userId &&
        sessionInfo.sessionId
      ) {
        startProcurement(
          prompt,
          sessionInfo.appName,
          sessionInfo.userId,
          sessionInfo.sessionId,
          inlineData,
          (step, description, index) => {
            try {
              description = description.replace(/```json|```/g, '').trim();
              const parsed = JSON.parse(description)
              const Component = stepComponentMap[step];

              if (Component) {
                descriptions[index] = <Component data={parsed} />;
              }
              else {
                descriptions[index] = description;
              }
            } catch (e) {
              descriptions[index] = description;
            }

            setStepDescriptions([...descriptions]);
            setWorkflowStep(index + 1);
          }
        );
      } else {
        console.error('Session information is missing.');
      }
    }

  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">Procurement Request</h2>

      <RequestInput onSubmit={handleSubmit} showFileInput={true} />

      {submitted && (
        <div className="mt-8">
          <StepTabs
            steps={PROCUREMENT_STEPS}
            activeStep={activeTab}
            workflowStep={workflowStep}
            onTabClick={setActiveTab}
          />
          <StepContent description={stepDescriptions[activeTab]} />
        </div>
      )}
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}


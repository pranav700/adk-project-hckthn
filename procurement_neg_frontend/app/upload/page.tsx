'use client';

import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import RequestInput from '@/components/RequestInput';
import StepTabs from '@/components/StepTabs';
import StepContent from '@/components/StepContent';
import { agentToComponent, APP_NAME, getNextRequestId, PROCUREMENT_AGENTS, PROCUREMENT_STEPS, SESSION_ID, USER_ID } from '@/lib/constants';
import { startProcurement } from '@/lib/api/sse/startProcurementSSE';
import { createSession } from '@/lib/api/rest/startSession';
import OverviewCard from '@/components/OverviewCard';
import SupplierQuoteCard from '@/components/SupplierQuoteCard';
import StrategyCard from '@/components/StrategyCard';
import EmailDraftEditor from '@/components/EmailDraftEditor';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateRequestId, saveVersionApi, updateStatusApi } from '@/lib/api/rest/procurement';
import StatusBadge from '@/components/StatusBadge';


export default function UploadPage() {
  const [submitted, setSubmitted] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [stepDescriptions, setStepDescriptions] = useState<ReactNode[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{ sessionId: string; appName: string; userId: string; } | null>(null);
  const hasInitialized = useRef(false);
  const stepComponentMap: Record<string, (props: { data: any }) => JSX.Element> = {};
  const [progress, setProgress] = useState(0);
  const totalSteps = PROCUREMENT_STEPS.length;
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [customMessage, setCustomMessage] = useState("Processing your procurement request...");
  const [status, setStatus] = useState<'pending' | 'countered' | string>('pending');


  PROCUREMENT_AGENTS.forEach(agent => {
    const Component = agentToComponent[agent as keyof typeof agentToComponent] || OverviewCard; // fallback component
    stepComponentMap[agent] = (props) => {
      if (agent === 'comms_agent') {
        return (
          <EmailDraftEditor
            quote={props.data}
            onSend={async () => {
              try {
                await updateStatusApi({ quote_status: 'countered', request_id: localStorage.getItem('request-id') || '' });
                setStatus('countered');
              } catch (e) {
                // error handled inside updateStatus or here if needed
              }
            }}
          />
        );
      }
      return <Component quote={props.data} />;
    };
  });


  useEffect(() => {

    localStorage.removeItem('request-id');
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
    setShowProgressDialog(true);
    setCustomMessage("Our Agents are analysing your file and generating insights...");
    let id = localStorage.getItem('request-id');
    if (!id) {
      id = await generateRequestId();
      localStorage.setItem('request-id', id);
    }
    setSubmitted(true);
    setWorkflowStep(1);
    setActiveTab(0);

    if (file?.type.startsWith('image/') || file?.type === 'application/pdf') {
      // Handle image file upload
      const dataUrl = await readAsDataUrl(file);
      const base64Data = dataUrl.split(',')[1];
      const inlineData = { data: base64Data, mimeType: file.type };

      const descriptions: ReactNode[] = [];
      const rawSteps: Record<string, any> = {}; // For BigQuery

      if (
        sessionInfo &&
        sessionInfo.appName &&
        sessionInfo.userId &&
        sessionInfo.sessionId
      ) {
        try {
          setCustomMessage("Starting procurement process...");
          await new Promise<void>((resolve, reject) => {
            startProcurement(
              prompt,
              sessionInfo.appName,
              sessionInfo.userId,
              sessionInfo.sessionId,
              inlineData,
              (step, description, index) => {
                try {
                  setCustomMessage(`Running step ${index + 1}: ${step.replace(/_/g, ' ')}`);
                  setProgress(Math.round(((index + 1) / totalSteps) * 100));
                  description = description.replace(/```json|```/g, '').trim();
                  const parsed = JSON.parse(description)
                  rawSteps[step] = parsed;
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
                setCustomMessage(`Agents have analysed your file`);
                setProgress(Math.round(((index + 1) / totalSteps) * 100));
                if (index + 1 === totalSteps) {
                  resolve();
                }
              })
          }
          );
        } catch (error) {
          console.error('Error starting procurement:', error);
        }
        try {
          await saveVersionApi({
            requestId: id,
            userId: sessionInfo.userId,
            sessionId: sessionInfo.sessionId,
            appName: sessionInfo.appName,
            timestamp: new Date().toISOString(),
            stepOutputs: JSON.stringify(rawSteps),
            quote_status: 'pending',
          });
        } catch (error) {
          console.error('Error saving version:', error);
        }

      } else {
        console.error('Session information is missing.');
      }
    }

  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h2 className="text-l font-bold text-black-800 flex items-center space-x-3">
        {submitted && (
          <><span> ReqID</span>
            <span className="text-blue-600">{localStorage.getItem('request-id')}</span>
            <span>Status:</span>
            <StatusBadge status={status} />
          </>
        )}
      </h2>



      <Dialog open={showProgressDialog} onOpenChange={(open) => {
        setShowProgressDialog(open);
        if (!open) {
          // Clear everything when dialog closes

          setActiveTab(0);
          setProgress(0);
          setCustomMessage("Processing your procurement request...");
        }
      }}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-700">
              {customMessage}
            </DialogTitle>
            <DialogDescription>
              Step {workflowStep} of {totalSteps}
            </DialogDescription>
          </DialogHeader>

          <Progress value={progress} className="mt-4" />

          {/* <ul className="list-disc list-inside text-sm text-gray-700 mt-4 space-y-1 max-h-48 overflow-y-auto">
            {stepDescriptions.map((desc, i) => (
              <li key={i}>
                {typeof desc === "string" ? desc : `Step ${i + 1} completed.`}
              </li>
            ))}
          </ul> */}

          {progress === 100 && (
            <div className="text-green-600 font-medium mt-4">All steps completed!</div>
          )}
        </DialogContent>
      </Dialog>

      {!submitted && (
        <><h2 className="text-l font-bold text-blue-800">Procurement Request: Upload your file and our agents will do all heavy lifting</h2>
          <RequestInput onSubmit={handleSubmit} showFileInput={true} /></>
      )}

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


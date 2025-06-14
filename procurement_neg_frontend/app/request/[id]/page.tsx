'use client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import RequestInput from '@/components/RequestInput';
import { startProcurement } from '@/lib/api/sse/startProcurementSSE';
import { agentToComponent, getNextRequestId, PROCUREMENT_AGENTS, PROCUREMENT_STEPS } from '@/lib/constants';
import { JSX, ReactNode, use, useEffect, useState } from 'react';
import StepTabs from '@/components/StepTabs';
import StepContent from '@/components/StepContent';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { fetchVersionsByRequestId, updateStatusApi, saveVersionApi } from '@/lib/api/rest/procurement';
import StatusBadge from '@/components/StatusBadge';
import OverviewCard from '@/components/OverviewCard';
import EmailDraftEditor from '@/components/EmailDraftEditor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';



export default function RequestDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [submitted, setSubmitted] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [stepDescriptions, setStepDescriptions] = useState<ReactNode[]>([]);
  const [latestStatus, setLatestStatus] = useState<string>('');
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const totalSteps = PROCUREMENT_STEPS.length;
  const [customMessage, setCustomMessage] = useState("Re-Processing your procurement request...");
  const [progress, setProgress] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);



  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await fetchVersionsByRequestId(id as string);
        const sorted = data.sort((a, b) => new Date(b.version_ts).getTime() - new Date(a.version_ts).getTime());
        setVersions(sorted);
        setStepDescriptions(extractDescriptions(sorted[0]?.step_outputs || {}));
        setLatestStatus(sorted[0]?.quote_status);
      } catch (err) {
        console.error("Error fetching versions:", err);
      }
    };
    fetchVersions();
  }, [id]);

  const stepComponentMap: Record<string, (props: { data: any }) => JSX.Element> = {};

  PROCUREMENT_AGENTS.forEach(agent => {
    const Component = agentToComponent[agent as keyof typeof agentToComponent] || OverviewCard;

    stepComponentMap[agent] = (props) => {
      if (agent === 'comms_agent') {
        return (
          <EmailDraftEditor
            quote={props.data}
            onSend={async () => {
              await updateStatusApi({ quote_status: 'countered', request_id: localStorage.getItem('request-id') || '' });
              setLatestStatus('countered');
            }}
          />
        );
      }
      return <Component quote={props.data} />;
    };
  });


  const extractDescriptions = (stepOutputs: any): ReactNode[] => {
    return PROCUREMENT_AGENTS.map((step: string) => {
      const data = stepOutputs?.[step];
      const Component = stepComponentMap[step];
      if (Component && data) {
        return <Component data={data} />;
      } else {
        return "No description available";
      }
    });
  };

  const handleSubmit = async (file: File | null, prompt: string) => {
    setUploadedFileName(file?.name || null);
    setSubmitted(true);
    setWorkflowStep(1);
    setActiveTab(0);
    setShowProgressDialog(true);


    setTimeout(() => setWorkflowStep(2), 2000);
    setTimeout(() => setWorkflowStep(3), 4000);

    const descriptions: ReactNode[] = [];
    const rawSteps: Record<string, any> = {};

    const latestVersion = versions[0];
    const appName = latestVersion?.app_name;
    const userId = latestVersion?.user_id;
    const sessionId = latestVersion?.session_id;
    try {
      setCustomMessage("Countering procurement process...");
      await new Promise<void>((resolve, reject) => {

        startProcurement(
          prompt,
          appName,
          userId,
          sessionId,
          {},
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
            setCustomMessage(`Agents have analysed your response`);
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
        requestId: id ? id.toString() : '',
        userId: userId,
        sessionId: sessionId,
        appName: appName,
        timestamp: new Date().toISOString(),
        stepOutputs: JSON.stringify(rawSteps),
        quote_status: 'countered',
      });
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  const handleVersionChange = (index: string) => {
    const version = versions[parseInt(index)];
    setSelectedVersionIndex(parseInt(index));
    setStepDescriptions(extractDescriptions(version.step_outputs));
    setLatestStatus(version.quote_status);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>Back</Button>

      <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-500" /> Details for {id}
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


      <div className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row gap-6">

        {/* Left column (Vertical Tabs and Status) */}
        <div className="md:w-2/3 flex gap-6">
          <div className="w-48">
            <StepTabs
              steps={PROCUREMENT_STEPS}
              activeStep={activeTab}
              workflowStep={workflowStep}
              onTabClick={setActiveTab}
              orientation="vertical"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Latest Status:</span><StatusBadge status={latestStatus} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Version</label>
              <Select onValueChange={handleVersionChange} defaultValue="0">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {new Date(version.version_ts).toLocaleString("en-GB",)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <StepContent description={stepDescriptions[activeTab]} />
          </div>
        </div>

        {/* Right column (File input + previously uploaded) */}
        <div className="md:w-1/3 space-y-4">
          <RequestInput onSubmit={handleSubmit} showFileInput={false} />
          {uploadedFileName && (
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Uploaded File:</span> {uploadedFileName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

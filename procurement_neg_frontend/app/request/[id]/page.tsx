'use client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import RequestInput from '@/components/RequestInput';
import { startProcurement } from '@/lib/api/sse/startProcurementSSE';
import { getNextRequestId, PROCUREMENT_STEPS } from '@/lib/constants';
import { useEffect, useState } from 'react';
import StepTabs from '@/components/StepTabs';
import StepContent from '@/components/StepContent';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { fetchVersionsByRequestId } from '@/lib/api/rest/procurement';

export default function RequestDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [submitted, setSubmitted] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [stepDescriptions, setStepDescriptions] = useState<string[]>([]);
  const [latestStatus, setLatestStatus] = useState<string>('');
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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

  const extractDescriptions = (stepOutputs: any): string[] => {
    return PROCUREMENT_STEPS.map((step: string) => stepOutputs?.[step]?.description || 'No description available');
  };

  const handleSubmit = async (file: File | null, prompt: string) => {
    const req_id = getNextRequestId();
    localStorage.setItem('request-id', req_id);
    setUploadedFileName(file?.name || null);
    setSubmitted(true);
    setWorkflowStep(1);
    setActiveTab(0);

    setTimeout(() => setWorkflowStep(2), 2000);
    setTimeout(() => setWorkflowStep(3), 4000);

    const descriptions: string[] = [];

    startProcurement(prompt, "", "", "", {}, (step, description, index) => {
      descriptions[index] = description;
      setStepDescriptions([...descriptions]);
      setWorkflowStep(index + 1);
    });
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

      <div className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row gap-6">

        {/* Left column (Vertical Tabs and Status) */}
        <div className="md:w-2/3 flex gap-6">
          <div className="w-48">
            <StepTabs
              steps={PROCUREMENT_STEPS}
              activeStep={activeTab}
              workflowStep={workflowStep}
              onTabClick={setActiveTab}
            //orientation="vertical"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Latest Status:</span> {latestStatus}
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
                      {new Date(version.version_ts).toLocaleString()}
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
          <RequestInput onSubmit={handleSubmit} showFileInput={true} />
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

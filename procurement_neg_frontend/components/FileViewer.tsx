'use client';

import { viewfileApi } from '@/lib/api/rest/filehandler';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Expand } from 'lucide-react';

interface FileViewerProps {
  requestId: string;
  userId: string;
  sessionId: string;
}

export default function FileViewer({ requestId, userId, sessionId }: FileViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(0.5);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchFileUrl = async () => {
      try {
        const res = await viewfileApi(requestId, userId, sessionId);
        setFileUrl(res);
      } catch (err) {
        console.error("Failed to fetch file URL", err);
      }
    };
    if (requestId && userId && sessionId) {
      fetchFileUrl();
    }
  }, [requestId, userId, sessionId]);

  if (!fileUrl) return null;

  return (
    <>
      {/* Inline Viewer */}
      <div className="mt-4 border p-2 bg-white rounded shadow">
        <div className="relative">
          <iframe
            src={fileUrl}
            className="w-full aspect-[4/3] border"
            style={{ height: 'auto', minHeight: '400px' }}
            allow="fullscreen"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="absolute top-2 right-2 bg-white shadow hover:bg-gray-100"
          >
            <Expand className="w-5 h-5" />
          </Button>
        </div>

        <div className="mt-2 text-sm">
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download File
          </a>
        </div>
      </div>

      {/* Modal Viewer */}
      <Dialog open={open} onOpenChange={(v) => {
        setOpen(v);
        setZoom(1); // Reset zoom when closed
      }}>
        <DialogContent className="w-full max-w-6xl h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Zoom Viewer</DialogTitle>
          </DialogHeader>

          <div className="relative h-full w-full bg-gray-100" style={{
            width: '100%',
            height: 'calc(90vh - 60px)',
            overflow: 'auto',
            background: '#f3f4f6',
            position: 'relative',
          }}>
            <iframe
              src={fileUrl}
              className="w-full h-[calc(90vh-60px)] border-none"
              allow="fullscreen"
              style={{ height: 450 }}
            />


            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-4 right-4 bg-white shadow-lg rounded-md flex items-center space-x-1 p-1 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              >
                –
              </Button>
              <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              >
                +
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  onSubmit: (file: File | null, prompt: string) => void;
  showFileInput?: boolean;
}

export default function RequestInput({ onSubmit, showFileInput = true }: Props) {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const isSubmitDisabled = !prompt.trim() || (showFileInput && !file);


  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow">
      <Textarea
        rows={4}
        placeholder="Describe your request..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      {showFileInput && (
        <div className="flex items-center space-x-4">
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file && <span className="text-sm text-gray-600">{file.name}</span>}
        </div>
      )}
      <Button disabled={isSubmitDisabled} onClick={() => onSubmit(file, prompt)}>Submit</Button>
    </div>
  );
}

import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Axios } from '~/lib/axios.util';
import type { TranscriptionResult } from '~/models/transcript.model';

type Props = {
  id: string;
  fileName: string;
  blob: Blob;
  type: string;
  deleteFile: (fileName: string) => void;
};

type ResultProps = {
  result: TranscriptionResult | null;
};

function ResultText({ result }: ResultProps) {
  if (!result) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[20px] w-full rounded-sm" />
        <Skeleton className="h-[20px] w-1/2 rounded-sm" />
      </div>
    );
  }

  if (result.status !== 'COMPLETED') {
    return (
      <div>
        <div className="font-bold text-sm leading-6 text-gray-900 mb-2">結果：</div>
        <div className="text-sm leading-6 text-gray-500">音声認識にエラーが発生しました。</div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-bold text-sm leading-6 text-gray-900 mb-2">結果：</div>
      {result.results.transcripts.map((t, idx) => (
        <div key={idx} className="text-sm leading-6 text-gray-500">
          <div>{t.transcript}</div>
        </div>
      ))}
    </div>
  );
}

export default function Record({ id, fileName, blob, type, deleteFile }: Props) {
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const processingRef = useRef<boolean>(false);

  useEffect(() => {
    if (processingRef.current) {
      return;
    }
    const process = async () => {
      const newFileName = `${id}.${fileName.split('.').pop()}`;
      const file = new File([blob], newFileName, { type: type, lastModified: Date.now() });
      const signedUrl = await Axios.getSignedUrl(newFileName);
      await Axios.uploadFile(signedUrl, file);
      const result = await Axios.getTranscriptionResult(id);
      setResult(result);
    };
    processingRef.current = true;
    process();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{fileName}</CardTitle>
        <CardAction>
          <Button variant="secondary" size="icon" className="size-8" onClick={() => deleteFile(fileName)}>
            <Trash2 />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ResultText result={result} />
      </CardContent>
    </Card>
  );
}

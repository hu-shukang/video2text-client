import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Axios } from '~/lib/axios.util';
import type { TranscriptionResult } from '~/models/transcript.model';

/**
 * Recordコンポーネントのプロパティ。
 */
type Props = {
  /** 文字起こしジョブの一意なID。 */
  id: string;
  /** ファイルの元の名前。 */
  fileName: string;
  /** Blob形式の生の音声データ。 */
  blob: Blob;
  /** 音声のMIMEタイプ。 */
  type: string;
  /** 親コンポーネントからファイルを削除するためのコールバック関数。 */
  deleteFile: (fileName: string) => void;
};

/**
 * ResultTextコンポーネントのプロパティ。
 */
type ResultProps = {
  /** 文字起こし結果オブジェクト。まだロード中の場合はnull。 */
  result: TranscriptionResult | null;
};

/**
 * 文字起こし結果、またはローディング/エラー状態をレンダリングするコンポーネント。
 * @param {ResultProps} props - コンポーネントのプロパティ。
 */
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

/**
 * 個々の録音ファイルを表示し、そのアップロード処理と文字起こし結果の表示を担当するコンポーネント。
 * ファイルがマウントされると、自動的にアップロードと文字起こしの処理を開始します。
 * @param {Props} props - コンポーネントのプロパティ。
 */
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

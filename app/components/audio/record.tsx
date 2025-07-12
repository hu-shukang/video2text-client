import { Trash2 } from 'lucide-react';
import { type JSX, useEffect, useMemo, useRef, useState } from 'react';
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
  /** 検索キーワード */
  keyword: string;
};

/**
 * ResultTextコンポーネントのプロパティ。
 */
type ResultProps = {
  /** 文字起こし結果オブジェクト。まだロード中の場合はnull。 */
  result: TranscriptionResult | null;
  /** 検索キーワード */
  keyword: string;
};

type TextProps = {
  /** 検索キーワード */
  keyword: string;
  /** テキスト */
  text: string;
};

/**
 * 文字起こしテキストをレンダリングするコンポーネント。
 * @param {TextProps} props - コンポーネントのプロパティ。
 */
function TranscriptText({ text, keyword }: TextProps) {
  const partList = useMemo(() => {
    const pattern = new RegExp(keyword, 'gi');
    const matches = text.matchAll(pattern);

    const result: Array<JSX.Element> = [];
    if (matches === null) {
      result.push(<span>{text}</span>);
      return result;
    }
    const matchArray = Array.from(matches);
    let beforeIndex = 0;
    for (let i = 0; i < matchArray.length; i++) {
      const match = matchArray[i];
      const start = match.index;
      const end = match.index + match[0].length;
      const before = text.slice(beforeIndex, start);
      beforeIndex = end;
      const keyword = match[0];
      result.push(<span>{before}</span>);
      result.push(<span className="bg-red-600 text-white">{keyword}</span>);
    }
    if (beforeIndex < text.length) {
      result.push(<span>{text.slice(beforeIndex)}</span>);
    }
    return result;
  }, [keyword, text]);

  return <div className="text-sm leading-6 text-gray-500">{partList}</div>;
}

/**
 * 文字起こし結果、またはローディング/エラー状態をレンダリングするコンポーネント。
 * @param {ResultProps} props - コンポーネントのプロパティ。
 */
function ResultText({ result, keyword }: ResultProps): JSX.Element {
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
        <TranscriptText key={idx} keyword={keyword} text={t.transcript} />
      ))}
    </div>
  );
}

/**
 * 個々の録音ファイルを表示し、そのアップロード処理と文字起こし結果の表示を担当するコンポーネント。
 * ファイルがマウントされると、自動的にアップロードと文字起こしの処理を開始します。
 * @param {Props} props - コンポーネントのプロパティ。
 */
export default function Record({ id, fileName, blob, type, deleteFile, keyword }: Props) {
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
        <ResultText result={result} keyword={keyword} />
      </CardContent>
    </Card>
  );
}

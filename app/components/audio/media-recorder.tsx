import { useCallback, useState } from 'react';
import { ReactMediaRecorder, type StatusMessages } from 'react-media-recorder';
import { v4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  onSubmit: (file: File) => void;
};

function RecordStatus({ status }: { status: StatusMessages }) {
  if (status === 'idle') {
    return <div className="text-gray-500 text-sm">録音を開始してください。</div>;
  }
  if (status === 'recording') {
    return <div className="text-gray-500 text-sm">録音中...</div>;
  }
  if (status === 'paused') {
    return <div className="text-gray-500 text-sm">録音停止中...</div>;
  }
  if (status === 'stopped') {
    return <div className="text-gray-500 text-sm">録音完了</div>;
  }
  return null;
}

export default function MediaRecorder({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);

  const submitHandler = useCallback(
    async (blobUrl: string) => {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const id = v4();
      const type = blob.type;
      const fileName = `録音_${id}.${type.split('/').pop()}`;
      const file = new File([blob], fileName, { type: type });
      console.log('file', file);
      onSubmit(file);
      setOpen(false);
    },
    [onSubmit, setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">録音する</Button>
      </DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>マイクから録音する</DialogTitle>
          <DialogDescription>ブラウザからマイクにアクセスする権限が必要です。</DialogDescription>
        </DialogHeader>
        <ReactMediaRecorder
          audio={true}
          video={false}
          render={({
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
            pauseRecording,
            resumeRecording,
            clearBlobUrl,
          }) => (
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                {['stopped', 'idle', 'acquiring_media'].includes(status) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      startRecording();
                      clearBlobUrl();
                    }}
                    size="icon"
                    className="size-12"
                  >
                    <img src="/mic.png" alt="mic" className="size-5" />
                  </Button>
                )}
                {['paused'].includes(status) && (
                  <Button variant="outline" onClick={resumeRecording} size="icon" className="size-12">
                    <img src="/mic.png" alt="mic" className="size-5" />
                  </Button>
                )}
                {['recording'].includes(status) && (
                  <Button variant="outline" onClick={pauseRecording} size="icon" className="size-12">
                    <img src="/pause.png" alt="mic" className="size-5" />
                  </Button>
                )}
                {['recording', 'paused'].includes(status) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      stopRecording();
                    }}
                    size="icon"
                    className="size-12"
                  >
                    <img src="/stop.png" alt="mic" className="size-5" />
                  </Button>
                )}
                <RecordStatus status={status} />
                {mediaBlobUrl && (
                  <audio src={mediaBlobUrl} className="h-[48px]" controls autoPlay={false} loop={false} />
                )}
              </div>
              <div className="text-right space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  キャンセル
                </Button>
                {mediaBlobUrl ? (
                  <Button type="submit" onClick={() => submitHandler(mediaBlobUrl)}>
                    アップロード
                  </Button>
                ) : (
                  <Button disabled>アップロード</Button>
                )}
              </div>
            </div>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

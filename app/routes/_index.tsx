import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 } from 'uuid';
import MediaRecorder from '~/components/audio/media-recorder';
import Record from '~/components/audio/record';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';

import type { Route } from './+types/_index';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home({}: Route.ComponentProps) {
  const [files, setFiles] = useState<Array<File>>([]);
  const fileSelecterRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fs = e.target.files;
      if (fs === null) {
        return;
      }
      const list = Array.from(fs).filter((f) => files.map((file) => file.name).every((name) => name !== f.name));
      if (fs.length !== list.length) {
        toast.warning('既に選択されたファイルをスキップします。', { position: 'top-center' });
      }
      setFiles([...files, ...list]);
    },
    [files, setFiles],
  );

  const deleteFile = useCallback(
    (fileName: string) => {
      setFiles((files) => files.filter((file) => file.name !== fileName));
    },
    [setFiles],
  );

  const pushFile = useCallback(
    (file: File) => {
      setFiles((files) => [...files, file]);
    },
    [setFiles],
  );
  return (
    <>
      <div className="px-2 sm:px-10">
        <h1 className="text-3xl font-bold text-center py-3">音声から文字起こし</h1>
        <div className="space-y-2">
          <input
            ref={fileSelecterRef}
            type="file"
            className="hidden"
            accept="audio/.mp3,audio/wav,audio/m4a,audio/ogg,audio/flac,audio/amr,audio/webm"
            onChange={onChange}
            multiple={true}
          />
          <div className="flex gap-3 items-center">
            <MediaRecorder onSubmit={pushFile} />
            <div className="w-[2px] h-[24px] bg-gray-300"></div>
            <Button variant="outline" onClick={() => fileSelecterRef.current?.click()}>
              音声ファイル選択
            </Button>
            <div className="inline-block text-xs text-gray-500 pl-2">
              サポートファイル形式: .mp3, .wav, .m4a, .ogg, .flac, .amr, .webm
            </div>
          </div>

          {files.map((file) => {
            const id = v4();
            const fileName = file.name;
            const type = file.type;
            return (
              <div key={fileName}>
                <Record id={id} fileName={fileName} blob={file} type={type} deleteFile={deleteFile} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

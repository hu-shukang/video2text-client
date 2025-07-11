import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 } from 'uuid';
import { Axios } from '~/lib/axios.util';

import { Button } from '@/components/ui/button';

import Record from './record';

export function FileSelectForm() {
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

  // const onSubmit = async () => {
  //   if (file === null) {
  //     return alert('no file');
  //   }
  //   const id = v4();
  //   const fileName = `${id}.${file.name.split('.').pop()}`;
  //   const signedUrl = await Axios.getSignedUrl(fileName);
  //   const newFile = new File([file], fileName, { type: file.type });
  //   await Axios.uploadFile(signedUrl, newFile);
  //   const result = await Axios.getTranscriptionResult(id);
  //   console.log(result);
  // };

  return (
    <div className="space-y-2">
      <input
        ref={fileSelecterRef}
        type="file"
        className="hidden"
        accept="audio/.mp3,audio/wav,audio/m4a,audio/ogg,audio/flac,audio/amr,audio/webm"
        onChange={onChange}
        multiple={true}
      />
      <div>
        <Button variant="outline" onClick={() => fileSelecterRef.current?.click()}>
          音声ファイル選択
        </Button>
      </div>
      <div className="text-xs text-gray-500 border-l-2 pl-2 border-gray-500">
        サポートファイル形式: .mp3, .wav, .m4a, .ogg, .flac, .amr, .webm
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
  );
}

import { useCallback, useState } from 'react';
import { v4 } from 'uuid';
import { Axios } from '~/lib/axios.util';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FileSelectForm() {
  const [file, setFile] = useState<File | null>(null);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setFile(file);
    },
    [setFile],
  );

  const onSubmit = async () => {
    if (file === null) {
      return alert('no file');
    }
    const id = v4();
    const fileName = `${id}.${file.name.split('.').pop()}`;
    const signedUrl = await Axios.getSignedUrl(fileName);
    const newFile = new File([file], fileName, { type: file.type });
    await Axios.uploadFile(signedUrl, newFile);
    const result = await Axios.getTranscriptionResult(id);
    console.log(result);
  };

  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="file" accept="audio/*" onChange={onChange} />
      <Button type="submit" variant="outline" onClick={onSubmit}>
        アップロード
      </Button>
    </div>
  );
}

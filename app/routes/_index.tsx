import { FileSelectForm } from '~/components/audio/file-select-form';

import type { Route } from './+types/_index';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home({}: Route.ComponentProps) {
  return (
    <>
      <div className="px-2 sm:px-10">
        <h1 className="text-3xl font-bold text-center py-3">音声から文字起こし</h1>
        <FileSelectForm />
      </div>
    </>
  );
}

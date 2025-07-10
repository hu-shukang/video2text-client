import dayjs from 'dayjs';
import { ReactMediaRecorder } from 'react-media-recorder';
import { useTimer } from 'react-timer-hook';
import { FileSelectForm } from '~/components/audio/file-select-form';
import { Button } from '~/components/ui/button';

import type { Route } from './+types/_index';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home({}: Route.ComponentProps) {
  const expiryTimestamp = dayjs().add(10, 'minute').toDate();

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
    interval: 20,
    autoStart: false,
  });
  return (
    <div>
      <FileSelectForm />
      <ReactMediaRecorder
        audio={true}
        video={false}
        render={({ status, startRecording, stopRecording, mediaBlobUrl, pauseRecording, resumeRecording }) => (
          <div>
            <div className="inline-flex space-x-2">
              {['stopped', 'idle', 'acquiring_media'].includes(status) && (
                <Button variant="outline" onClick={startRecording} size="icon" className="size-12">
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
              <Button variant="outline" onClick={stopRecording} size="icon" className="size-12">
                <img src="/stop.png" alt="mic" className="size-5" />
              </Button>
              <p>{status}</p>
            </div>
            <audio src={mediaBlobUrl} controls autoPlay={false} loop={false} />
          </div>
        )}
      />
    </div>
  );
}

import axios from 'axios';
import type { TranscriptionResult } from '~/models/transcript.model';

import { delay } from './utils';

const getSignedUrl = async (fileName: string) => {
  const signedUrlResp = await axios.post<{ signedUrl: string }>('/api/audio/signed-url', { fileName });
  return signedUrlResp.data.signedUrl;
};

const uploadFile = async (signedUrl: string, file: File) => {
  await axios.put(signedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

const getTranscriptionResult = async (id: string) => {
  const maxRetries = 100;
  const retryInterval = 3000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get<TranscriptionResult>(`/audio/output/${id}.json`);
      return response.data;
    } catch (_error) {
      console.log(`${i + 1} 回目の取得試行に失敗し、${retryInterval / 1000} 秒ごに再度試行する...`);
      await delay(retryInterval);
    }
  }

  throw new Error(`全 ${maxRetries} 回目の取得試行は全部失敗しました。`);
};

export const Axios = {
  getSignedUrl,
  uploadFile,
  getTranscriptionResult,
};

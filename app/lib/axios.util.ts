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
  const retryInterval = 2000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get<TranscriptionResult>(`/audio/output/${id}.json`);
      return response.data;
    } catch (_error) {
      console.log(`第 ${i + 1} 次尝试获取转录结果失败，将在 ${retryInterval / 1000} 秒后重试...`);
      await delay(retryInterval);
    }
  }

  // 如果在所有尝试之后仍然失败，则抛出错误
  throw new Error(`在 ${maxRetries} 次尝试后，仍无法获取 ID 为 ${id} 的转录结果。`);
};

export const Axios = {
  getSignedUrl,
  uploadFile,
  getTranscriptionResult,
};

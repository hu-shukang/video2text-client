import axios from 'axios';
import type { TranscriptionResult } from '~/models/transcript.model';

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

/**
 * 延迟指定毫秒数
 * @param ms - 延迟的毫秒数
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getTranscriptionResult = async (id: string) => {
  const maxRetries = 100;
  const retryInterval = 2000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get<TranscriptionResult>(`/audio/output/${id}.json?timestamp=${Date.now()}`);
      console.log(response.headers['Content-Type']);
      if (response.headers['Content-Type'] === 'text/html') {
        throw new Error('Unexpected response type. Expected JSON.');
      }
      // 如果请求成功 (状态码 2xx)，说明文件已存在，返回数据
      return response.data;
    } catch (error) {
      console.log(`第 ${i + 1} 次尝试获取转录结果失败，将在 ${retryInterval / 1000} 秒后重试...`);
      // 等待一段时间再进行下一次尝试
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

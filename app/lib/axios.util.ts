import axios from 'axios';
import type { TranscriptionResult } from '~/models/transcript.model';

import { delay } from './utils';

/**
 * サーバーからファイルアップロード用の署名付きURLを取得します
 *
 * @param fileName - アップロードするファイルの名前
 * @returns 署名付きURL
 */
const getSignedUrl = async (fileName: string) => {
  const signedUrlResp = await axios.post<{ signedUrl: string }>('/api/audio/signed-url', { fileName });
  return signedUrlResp.data.signedUrl;
};

/**
 * 署名付きURLを使用してファイルをアップロードします
 *
 * @param signedUrl - ファイルのアップロード先となる署名付きURL
 * @param file - アップロードするFileオブジェクト
 */
const uploadFile = async (signedUrl: string, file: File) => {
  await axios.put(signedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

/**
 * 指定されたIDの文字起こし結果をポーリングして取得します
 * 処理が完了するまで、設定された間隔でリトライを繰り返します
 *
 * @param id - 文字起こしジョブのID。
 * @returns 文字起こし結果を含むPromise。
 *
 * @throws 最大リトライ回数に達しても結果が取得できなかった場合にエラーをスローします。
 */
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

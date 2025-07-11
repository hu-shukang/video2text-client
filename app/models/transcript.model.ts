/** An alternative for a transcribed word. */
type WordAlternative = {
  confidence: string;
  content: string;
};

/** A transcribed item, which can be a word or punctuation. */
type TranscriptItem = {
  id: number;
  type: 'pronunciation' | 'punctuation';
  alternatives: WordAlternative[];
  start_time?: string; // Not present for punctuation
  end_time?: string; // Not present for punctuation
};

/** A detected language with its score. */
type LanguageIdentification = {
  code: string;
  score: string;
};

/** A segment of the audio with its transcript and item references. */
type AudioSegment = {
  id: number;
  transcript: string;
  start_time: string;
  end_time: string;
  items: number[];
};

/** The main results object from the transcription job. */
type TranscriptionResultsPayload = {
  language_code: string;
  language_identification: LanguageIdentification[];
  transcripts: { transcript: string }[];
  items: TranscriptItem[];
  audio_segments: AudioSegment[];
};

/** The overall structure of the transcription result JSON file. */
export type TranscriptionResult = {
  jobName: string;
  accountId: string;
  status: 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
  results: TranscriptionResultsPayload;
};

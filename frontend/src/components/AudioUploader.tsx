import { useRef } from "react";
import Icon from "./Icon";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_AUDIO_EXTENSION_TO_MIMETYPE: Record<string, string> = {
  "mp3":   "audio/mp3",
  "m4a":   "audio/x-m4a", 
  "webm":  "audio/webm",
  "wav":   "audio/wav",
  "aac":   "audio/aac",
  "ogg":   "audio/ogg",
  "flac":  "audio/flac",
}
const ALLOWED_AUDIO_EXTENSIONS = Object.keys(ALLOWED_AUDIO_EXTENSION_TO_MIMETYPE)
const INPUT_ACCEPT = Object.values(ALLOWED_AUDIO_EXTENSION_TO_MIMETYPE).join(",");

export interface AudioUploadData {
  blob: Blob,
  mimeType: string,
  extension: string,
}

interface AudioUploaderProps {
  onUpload: (data: AudioUploadData) => Promise<void> | void;
  onValidationError: (error: string) => void;
}

export default function AudioUploader({ onUpload, onValidationError }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase();
      const isTypeValid = ALLOWED_AUDIO_EXTENSIONS.includes(fileExtension);

      if (!isTypeValid) {
        onValidationError(`Unsupported file type. Please upload ${ALLOWED_AUDIO_EXTENSIONS.join(",")}.`);
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        onValidationError("File is too large. Maximum size allowed is 100MB.");
        e.target.value = "";
        return;
      }

      const audioData: AudioUploadData = {
        blob: file,
        mimeType: ALLOWED_AUDIO_EXTENSION_TO_MIMETYPE[fileExtension],
        extension: fileExtension
      };

      await onUpload(audioData);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* Hidden File Input for Audio Selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={INPUT_ACCEPT}
        className="hidden"
      />

      {/* Attachment Button */}
      <button
        onClick={handleAttachmentClick}
        title="Add Audio File"
        className="text-slate-500 hover:text-slate-700 p-2.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all focus:outline-none flex items-center justify-center relative group"
      >
        <Icon src="/icons/attachment.svg" className="w-6 h-6" colorClass="bg-slate-500" />
        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
          Add Audio File
        </span>
      </button>
    </>
  );
}

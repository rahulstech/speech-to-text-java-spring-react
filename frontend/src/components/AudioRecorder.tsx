import { useState } from "react";
import { useAudioRecorder, type AudioRecordOutput } from '../hooks/AudioRecorderHooks'


export default function AudioRecorder() {

    const [audioOutput, setAudioOutput] = useState<AudioRecordOutput>(null)
    

    const { 
        isRecording, ellapsedSeconds, 
        isError, error,
        startRecording, stopRecording 
    } = useAudioRecorder({

        stream: false,

        onStart() {
            setAudioOutput(null)
        },

        onStop(output: AudioRecordOutput) {
            setAudioOutput(output)
        },
    })

    return (
        <div>
            {
                isError ? <p>{error?.message ?? "error while recording" }</p>
                : isRecording 
                ? <div>Recording: {`${ellapsedSeconds}s`}</div> 
                : audioOutput === null || !audioOutput?.audioRecordUrl
                ? <p>Not recording and no old record found</p>
                : <audio src={audioOutput.audioRecordUrl} controls />
            }
            <div>
                <button onClick={startRecording}>Start Recording</button>
            </div>
            <div>
                <button onClick={stopRecording}>Stop Recording</button>
            </div>
        </div>
    )
}
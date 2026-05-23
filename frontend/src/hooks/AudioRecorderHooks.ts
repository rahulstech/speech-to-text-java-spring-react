import { useRef, useState } from "react"

const MAX_DATA_SIZE = 10 * 1024 * 1024 // 10MB
const MIME_TYPE = "audio/webm"

export interface AudioRecorderState {
    isRecording: boolean,
    ellapsedSeconds: number,
    isError: boolean,
    error?: Error
}

export interface AudioRecorderControl extends AudioRecorderState {
    startRecording: ()=> void,
    stopRecording: ()=> void,
}


export interface AudioRecordOutput {
    audioRecordUrl?: string,
    audioRecordBlob?: Blob,
    totalSeconds: number,
    mimeType: string
}

export interface AudioRecorderOptions {

    stream?: boolean,

    bufferSize?: number,

    onStart?: ()=> void

    onData?: (blob: Blob)=> Promise<void>,

    onStop?: (output: AudioRecordOutput)=> void
}


export function useAudioRecorder(options: AudioRecorderOptions = { stream: false }): AudioRecorderControl {
    const streamRef = useRef(null)
    const recorderRef = useRef<MediaRecorder>(null)
    const dataRef = useRef<Blob[]>([])
    const dataSizeRef = useRef(0)
    const [state, setState] = useState<AudioRecorderState>({ 
        isRecording: false, 
        ellapsedSeconds: 0,
        isError: false,
    })


    function combineData(): Blob {
        const blob = new Blob(dataRef.current, { 
            type: MIME_TYPE
        })
        return blob
    }

  

    function startRecording() {

        new Promise<MediaStream>(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                resolve(stream)
            }
            catch(reason: unknown) {
                reject(reason)
            }
        })
        .then(stream => {
            const recorder = new MediaRecorder(stream)
            recorderRef.current = recorder
            dataRef.current = []
            

            recorder.addEventListener('dataavailable',(event) => {
                const data = event.data
                if (data.size > 0) {
                    dataRef.current.push(data)
                    dataSizeRef.current = dataSizeRef.current + data.size

                    if (options.stream && dataSizeRef.current >= Math.min(options.bufferSize, MAX_DATA_SIZE)) {
                            const blob = combineData()
                            options.onData?.(blob)

                            // reset
                            dataRef.current = []
                            dataSizeRef.current = 0
                    }
                }
                setState(old => ({ ...old, ellapsedSeconds: old.ellapsedSeconds + 1 }))
            })

            recorder.addEventListener('start', () => {
                setState({ 
                    isRecording: true, 
                    ellapsedSeconds: 0, 
                    isError: false }
                )
                options.onStart?.()
            })

            recorder.addEventListener('stop', () => {
                stream.getTracks().forEach(t => t.stop)
                streamRef.current = null

                const currentState = state
                setState({
                    isRecording: false,
                    ellapsedSeconds: 0,
                    isError: false
                })
                
                let output: AudioRecordOutput
                if (options.stream) {
                    output = {
                        totalSeconds: currentState.ellapsedSeconds,
                        mimeType: ""
                    }
                }
                else {
                    const blob = combineData()
                    output = {
                        audioRecordBlob: blob,
                        audioRecordUrl: URL.createObjectURL(blob),
                        totalSeconds: currentState.ellapsedSeconds,
                        mimeType: ""
                    }
                }

                // clean up 
                dataRef.current = []
                dataSizeRef.current = 0
                recorderRef.current = null

                options.onStop?.(output)
            })

            recorder.start(1000) // send data after each 1s
            }
        ) 
        .catch( _ => {
            setState({
                isRecording: false,
                ellapsedSeconds: 0,
                isError: true,
                error: new Error("unnable to open microphone") // TODO: set a better stream error
            })
        })
    }

    function stopRecording() {
        recorderRef.current?.stop()
    }

    return {
        ...state, startRecording, stopRecording
    }
}
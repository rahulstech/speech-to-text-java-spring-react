import { useRef, useState } from "react"

const MIME_TYPE = "audio/webm"
const EXTENSTION = "wbem"

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
    blob: Blob,
    extension: string
}

export interface AudioRecorderOptions {

    onStart?: ()=> void

    onStop?: (output: AudioRecordOutput)=> Promise<void>
}


export function useAudioRecorder(options: AudioRecorderOptions): AudioRecorderControl {
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
                    audio: true,
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
                stream.getTracks().forEach(t => t.stop())
                streamRef.current = null

                setState({
                    isRecording: false,
                    ellapsedSeconds: 0,
                    isError: false
                })
                
                let output: AudioRecordOutput
                const blob = combineData()
                output = {
                    blob: blob,
                    extension: EXTENSTION
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
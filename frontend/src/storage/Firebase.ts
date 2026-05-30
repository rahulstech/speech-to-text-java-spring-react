import { initializeApp } from "firebase/app"
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage"

const ROOT_DIRECTORY = import.meta.env.VITE_FIREBASE_ROOT_DIRECTORY

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig)

const storage = getStorage(app)


export interface AudioStorageData {
    blob: Blob,
    extension: string
}

export async function uploadAudioBlob(data: AudioStorageData): Promise<string> {
    if (import.meta.env.DEV) {
        // in development mode return a fake audio url
        return "/audio.mp3"
    }
    
    const name = `${ROOT_DIRECTORY}/${crypto.randomUUID()}.${data.extension}`
    const objectRef = ref(storage, name)

    try {
        await uploadBytes(objectRef, data.blob)
        return getDownloadURL(objectRef)
    }
    catch {
        throw new Error("upload failed")
    }
}
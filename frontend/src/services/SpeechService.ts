import axios from "axios";
import type { HistoryQuery, HistoryResponse, History, TranscriptRequest } from "./types";
import { accessTokenStorage } from "../storage/TokenStorage";
import { userStorage } from "../storage/UserStorage";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/speech`
})


api.interceptors.request.use((config) => {
    const accessToken = accessTokenStorage.get()

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})

api.interceptors.response.use(
    // onFulfilled
    (response) => response,

    // onRejected
    (error) => {
        if (error.response?.status === 401) {
            accessTokenStorage.remove()
            userStorage.remove()
        }

        return Promise.reject(error)
    }
)


export async function getHistory({ before, after, first }: HistoryQuery): Promise<HistoryResponse> {
    let url = `/history?first=${first}`
    if (after) {
        url += `&after=${after}`
    }
    else if (before) {
        url += `&before=${before}`
    }

    const res = await api.get<HistoryResponse>(url)
    return res.data
}

export function transcribeAudio(req: TranscriptRequest): Promise<History> {
    return api.post<History>("", req).then(response => response.data);
}
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/speech"
})


export interface History {
    id: number,
    audioFile: string,
    transcript: string,
    createdAt: string
}

export interface HistoryResponse {
    cursorBefore: number | null,
    cursorAfter: number | null,
    size: number,
    histories: History[]
}

export interface HistoryQuery {
    before?: number,
    after?: number,
    first: number,
}


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

export function transcribeAudio(audioUrl: string, lang?: string): Promise<History> {
    return api.post<History>("", { audioUrl, lang }).then(response => response.data);
}
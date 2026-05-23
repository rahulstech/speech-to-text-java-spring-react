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


export function getHistory(page: number, size: number = 20): Promise<History[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            api.get<History[]>(`/history?page=${page}&size=${size}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(reject)
        }, 3000)
    })
}
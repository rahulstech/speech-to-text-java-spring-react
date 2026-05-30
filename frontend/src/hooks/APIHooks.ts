import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, transcribeAudio } from "../services/SpeechService";
import { uploadAudioBlob, type AudioStorageData } from "../storage/Firebase";
import type { History } from "../services/types";
import { useAppContext } from "../context/AppContext";
import { AxiosError } from "axios";

const HISTORY_SIZE = 20

export function useGetInfiniteHistory() {
    const { changeLoggedIn } = useAppContext()

    return useInfiniteQuery({
        queryKey: ["history"],
        queryFn: async ({ pageParam: query }) => {
            try {
                return await getHistory(query)
            }
            catch(error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        // unauthorized
                        changeLoggedIn(false)
                    }
                }
                else {
                    throw error
                }
            }
        },
        initialPageParam: { first: HISTORY_SIZE },
        getPreviousPageParam: (firstPage) => {
            if (!firstPage || firstPage.cursorBefore == null) {
                return undefined;
            }
            return { before: firstPage.cursorBefore, first: HISTORY_SIZE };
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.cursorAfter == null || lastPage.histories.length < HISTORY_SIZE) {
                return undefined;
            }
            return { after: lastPage.cursorAfter, first: HISTORY_SIZE };
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    })
}

export function useTranscribeAudio() {
    const queryClient = useQueryClient()
    const { changeLoggedIn } = useAppContext()

    return useMutation<History, Error, { data: AudioStorageData, lang: string | null }>({
        mutationFn: async (variables) => {
            try {
                return await uploadAudioBlob(variables.data)
                            .then(audioUrl => 
                                transcribeAudio({ audioUrl, lang: variables.lang })
                            )
            }
            catch(error: any) {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        // unauthorized
                        changeLoggedIn(false)
                    }
                }
                throw error
            }

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["history"],
            });
        }
    });
}
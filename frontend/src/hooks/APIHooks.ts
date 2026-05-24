import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, transcribeAudio } from "../services/SpeechService";

const HISTORY_SIZE = 20

export function useGetInfiniteHistory() {
    return useInfiniteQuery({
        queryKey: ["history"],
        queryFn: ({ pageParam: query }) => getHistory(query),
        initialPageParam: { first: HISTORY_SIZE },
        getPreviousPageParam: (firstPage) => ({ before: firstPage.cursorBefore, first: HISTORY_SIZE }),
        getNextPageParam: (lastPage) => ({ after: lastPage.cursorAfter, first: HISTORY_SIZE }),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    })
}

export function useTranscribeAudio() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ audioUrl, lang }: { audioUrl: string, lang?: string }) => transcribeAudio(audioUrl, lang),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["history"],
            });
        }
    });
}
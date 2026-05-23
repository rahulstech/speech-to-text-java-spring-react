import { useInfiniteQuery } from "@tanstack/react-query";
import { getHistory } from "../services/SpeechService";

export function useGetInfiniteHistory() {
    return useInfiniteQuery({
        queryKey: ["history"],
        queryFn: ({ pageParam: page }) => getHistory(page),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        }
    })
}
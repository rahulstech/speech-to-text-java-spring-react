import HistoryItem from "../components/HistoryItem";
import { useGetInfiniteHistory } from "../hooks/APIHooks";

export default function STTChat() {
     const { 
        data, error, 
        hasNextPage, fetchNextPage, 
        isFetching, isPending, isError
    } = useGetInfiniteHistory()

    return (
        <div>
            {
                isPending ? <p>Loading...</p> 
                : isError ? <p>{error.message}</p>
                : (
                    <>
                        {
                            data.pages.map( page => 
                                page.map( history => <HistoryItem history={history} /> )
                            )
                        }
                        {
                            isFetching ? <p>Loading More...</p> 
                            : !hasNextPage ? null 
                            : <button 
                                onClick={() => fetchNextPage() }>
                                Load More
                            </button>
                        }
                    </>
                )
            }
        </div>
    )
}
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import HistoryItem from "../components/HistoryItem";
import AudioInputBar from "../components/AudioInputBar";
import Icon from "../components/Icon";
import { useGetInfiniteHistory } from "../hooks/APIHooks";
import type { History } from "../services/types";
import Waveform from "../components/Waveform";
import { useUserLogout } from "../hooks/AuthHooks";
import { userStorage } from "../storage/UserStorage";

// Group items by day
function groupHistoryByDate(items: History[]) {
  const groups: { [key: string]: History[] } = {};

  // Sort oldest first so it scrolls like a conversation
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  sortedItems.forEach((item) => {
    const date = new Date(item.createdAt);
    const now = new Date();
    let dateLabel = "";

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      dateLabel = "TODAY";
    } else if (isYesterday) {
      dateLabel = "YESTERDAY";
    } else {
      const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric",
      };
      dateLabel = date.toLocaleDateString("en-US", options).toUpperCase();
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(item);
  });

  return Object.keys(groups).map((key) => ({
    dateLabel: key,
    items: groups[key],
  }));
};

export default function STTChat() {
  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
    isFetchingNextPage,
  } = useGetInfiniteHistory();
  const logoutMutation = useUserLogout()

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const lastItemIdRef = useRef<number | null>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevHistoryLengthRef = useRef<number>(0);
  const wasPendingRef = useRef<boolean>(false);
  
  // Maps a database history ID to the locally recorded blob URL
  const [localRecordings, setLocalRecordings] = useState<{ [id: number]: string }>({});

  const [isTranscribing, setIsTranscribing] = useState(false);

  // Flat map pages to list of items, deduplicating by ID to avoid React key collisions during shifting
  const historyItems = data
    ? data.pages.flatMap((page) => page.histories).filter((item, index, self) =>
        self.findIndex((t) => t.id === item.id) === index
      )
    : [];

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  // Set up intersection observer for infinite scroll / automatic page loading
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPageRef.current && !isFetchingNextPageRef.current) {
          fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: "100px 0px 0px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.unobserve(sentinel);
    };
  }, [fetchNextPage]);

  const wasFetchingNextPageRef = useRef(false);
  useEffect(() => {
    if (isFetchingNextPage) {
      wasFetchingNextPageRef.current = true;
    }
  }, [isFetchingNextPage]);

  // Auto-scroll and scroll stability management
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Sort items oldest first (matching the rendering order)
    const sortedItems = [...historyItems].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const lastItem = sortedItems[sortedItems.length - 1];
    const lastItemId = lastItem?.id ?? null;

    // 1. Check if we are transcribing or just started transcribing
    if (isTranscribing && !wasPendingRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      wasPendingRef.current = true;
      prevScrollHeightRef.current = container.scrollHeight;
      prevHistoryLengthRef.current = historyItems.length;
      lastItemIdRef.current = lastItemId;
      return;
    }
    if (!isTranscribing) {
      wasPendingRef.current = false;
    }

    // If history items are empty, nothing to scroll or adjust
    if (historyItems.length === 0) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevHistoryLengthRef.current = 0;
      lastItemIdRef.current = null;
      return;
    }

    // 2. Initial load: lastItemIdRef.current was null, now we have items
    if (lastItemIdRef.current === null && lastItemId !== null) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      prevScrollHeightRef.current = container.scrollHeight;
      prevHistoryLengthRef.current = historyItems.length;
      lastItemIdRef.current = lastItemId;
      return;
    }

    // 3. New message added at the bottom (newest item ID changed)
    if (lastItemIdRef.current !== null && lastItemId !== lastItemIdRef.current) {
      if (!wasFetchingNextPageRef.current) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      wasFetchingNextPageRef.current = false;
      prevScrollHeightRef.current = container.scrollHeight;
      prevHistoryLengthRef.current = historyItems.length;
      lastItemIdRef.current = lastItemId;
      return;
    }

    // 4. Older items prepended at the top (newest item ID is the same, but history length increased)
    if (
      lastItemIdRef.current !== null &&
      lastItemId === lastItemIdRef.current &&
      historyItems.length > prevHistoryLengthRef.current
    ) {
      const heightDifference = container.scrollHeight - prevScrollHeightRef.current;
      if (heightDifference > 0) {
        container.scrollTop = container.scrollTop + heightDifference;
      }
      wasFetchingNextPageRef.current = false;
    }

    // Keep refs up-to-date
    prevScrollHeightRef.current = container.scrollHeight;
    prevHistoryLengthRef.current = historyItems.length;
    lastItemIdRef.current = lastItemId;
  }, [historyItems, isTranscribing]);

  

  const groupedHistory = groupHistoryByDate(historyItems);

  // Error screen
  if (isError) {
    return (
      <div className="flex flex-col h-screen bg-[#F8F9FB] font-sans relative overflow-hidden min-w-[320px]">
        {/* Header */}
        <div className="bg-white h-16 border-b border-slate-100 shadow-sm w-full shrink-0 z-10">
          <div className="h-full flex items-center justify-between px-6">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              Hello {userStorage.get().name}
            </h1>
            <button
              onClick={()=> { logoutMutation.mutate() }}
              title="Logout"
              className="text-slate-600 hover:text-slate-800 transition-colors p-1.5 rounded-full hover:bg-slate-50 active:scale-95 focus:outline-none flex items-center justify-center relative group"
            >
              <Icon src="/icons/logout.svg" className="w-6 h-6" colorClass="bg-slate-600" />
              <span className="absolute top-full mt-2 right-0 hidden group-hover:block bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <Icon src="/icons/error.svg" className="w-12 h-12 mb-4" colorClass="bg-red-500" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Failed to load history</h2>
          <p className="text-sm text-slate-500 mb-6">{error?.message ?? "An unknown error occurred"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#F5A623] hover:bg-[#E0951D] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all active:scale-95 focus:outline-none"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FB] font-sans relative overflow-hidden min-w-[320px]">
      {/* Header */}
      <div className="bg-white h-16 border-b border-slate-100 shadow-sm w-full shrink-0 z-10">
        <div className="h-full flex items-center justify-between px-6">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Hello {userStorage.get()?.name ?? "user"}
          </h1>
          <button
            onClick={() => { logoutMutation.mutate() }}
            title="Logout"
            className="text-slate-600 hover:text-slate-800 transition-colors p-1.5 rounded-full hover:bg-slate-50 active:scale-95 focus:outline-none flex items-center justify-center relative group"
          >
            <Icon src="/icons/logout.svg" className="w-6 h-6" colorClass="bg-slate-600" />
            <span className="absolute top-full mt-2 right-0 hidden group-hover:block bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      
      { isPending ? 
        /* History skeleton items */
        <div className="flex-1 overflow-y-auto py-4 px-4 max-w-[900px] mx-auto w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-4 mx-4 animate-pulse"
            >
              <div className="bg-slate-100 rounded-full h-11 w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
              </div>
              <div className="h-3 bg-slate-100 rounded w-16 self-end" />
            </div>
          ))}
        </div>

        /* History list item */
        : <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto py-4 px-4 max-w-[900px] mx-auto w-full"
        >
          {/* Sentinel for infinite scroll */}
          <div ref={topSentinelRef} className="h-1" />

          {/* Loading Older Transcripts Loader */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center gap-2 py-3">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-500">Loading Older Transcripts...</span>
            </div>
          )}

          {groupedHistory.map((group) => (
            <div key={group.dateLabel}>
              <div className="flex justify-center my-6">
                <span className="bg-[#EAEAEE] text-[#7A7A85] text-[10px] font-bold tracking-wider px-4 py-1.5 rounded-full uppercase">
                  {group.dateLabel}
                </span>
              </div>
              {group.items.map((item) => (
                <HistoryItem
                  key={item.id}
                  history={item}
                  localAudioUrl={localRecordings[item.id]}
                />
              ))}
            </div>
          ))}

          {/* Transcribing loader item */}
          {isTranscribing && (
            <div className="bg-white rounded-3xl p-5 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-4 mx-4 animate-pulse">
              <div className="bg-slate-100 rounded-full py-2.5 px-5 flex items-center justify-between gap-4 border border-slate-50">
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  Transcribing...
                </span>

                <Waveform />

                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <p className="text-slate-400 text-[15px] italic leading-relaxed text-left px-1">
                Transcript of your audio will be available soon...
              </p>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      }

      {/* Bottom Bar Controls */}
      <AudioInputBar
        onTranscribeSuccess={(id, localUrl) => {
          setLocalRecordings((prev) => ({
            ...prev,
            [id]: localUrl,
          }));
        }}
        onTranscribeStart={() => setIsTranscribing(true)}
        onTranscribeEnd={() => setIsTranscribing(false)}
      />
    </div>
  );
}
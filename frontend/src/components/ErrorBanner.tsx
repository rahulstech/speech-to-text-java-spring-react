import Icon from "./Icon";
import { APIError } from "../services/APIError";

interface ErrorBannerProps {
  error: unknown;
  defaultMessage: string;
}

export default function ErrorBanner({ error, defaultMessage }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-5 flex items-start gap-2.5 animate-fadeIn">
      <Icon src="/icons/error.svg" className="w-4 h-4 mt-0.5 shrink-0" colorClass="bg-red-500" />
      <div className="text-[11px] font-semibold text-red-600 leading-normal">
        {(() => {
          if (error instanceof APIError) {
            if (Array.isArray(error.reason)) {
              return error.reason.map((msg, index) => (
                <div key={index}>{msg}</div>
              ));
            }
            return <div>{error.reason}</div>;
          }
          if (error instanceof Error) {
            return <div>{error.message}</div>;
          }
          return <div>{defaultMessage}</div>;
        })()}
      </div>
    </div>
  );
}

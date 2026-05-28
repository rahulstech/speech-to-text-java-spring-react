import React from "react";
import Icon from "./Icon";

interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  iconSrc: string;
  error?: string;
  disabled?: boolean;
}

export default function TextInputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  iconSrc,
  error,
  disabled = false,
}: TextInputFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[11px] font-bold text-slate-500 tracking-wide uppercase px-0.5">
        {label}
      </label>
      <div
        className={`relative flex items-center bg-[#F5F6F8] border rounded-2xl h-[52px] transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/10"
            : "border-slate-100 focus-within:border-[#F5C12E] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(245,193,46,0.15)]"
        }`}
      >
        {/* Icon at start (left-4) */}
        <div className="absolute left-4 flex items-center pointer-events-none">
          <Icon
            src={iconSrc}
            className="w-5 h-5"
            colorClass={error ? "bg-red-400" : "bg-slate-400"}
          />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent pl-12 pr-4 text-[14px] text-slate-700 font-medium placeholder-slate-300 focus:outline-none"
          disabled={disabled}
        />
      </div>
      {error && (
        <span className="text-[10px] text-red-500 font-semibold px-0.5">
          {error}
        </span>
      )}
    </div>
  );
}

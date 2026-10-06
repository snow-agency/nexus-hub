import { useId } from 'react';

export function Input({ label, leadingIcon: LeadingIcon, id, className = '', ...props }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-gray-800" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={15}
          />
        )}
        <input
          id={inputId}
          className={`h-11 w-full rounded-xl border border-[#E8E1D5] bg-[#FAF7F1] px-3 text-sm text-gray-800 outline-none transition focus:border-[#005C46] focus:ring-2 focus:ring-[#005C46]/10 ${LeadingIcon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

export default Input;

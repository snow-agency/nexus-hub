export function Button({ variant = 'primary', children, className = '', ...props }) {
  const variantClasses = {
    accent:
      'h-[62px] rounded-[20px] bg-accent px-8 text-xl font-normal text-dark shadow-[0_8px_18px_rgba(173,108,0,0.12)] hover:bg-accent-hover',
    outline:
      'h-[62px] rounded-[20px] border border-bg-light bg-white/80 px-8 text-xl font-normal text-dark hover:bg-white',
    login:
      'h-11 w-full rounded-lg bg-accent px-4 text-sm font-medium text-dark shadow-sm hover:bg-accent-hover',
    primary: 'rounded-md bg-primary text-white hover:bg-primary-hover',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

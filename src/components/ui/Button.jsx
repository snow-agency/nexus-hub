export function Button({ variant = 'primary', children, className = '', ...props }) {
  const variantClasses = {
    accent:
      'h-[62px] rounded-[20px] bg-[#F5A000] px-8 text-xl font-normal text-[#14241E] shadow-[0_8px_18px_rgba(173,108,0,0.12)] hover:bg-[#E39600]',
    outline:
      'h-[62px] rounded-[20px] border border-[#DED9CD] bg-white/80 px-8 text-xl font-normal text-[#1D2B27] hover:bg-white',
    primary: 'rounded-md bg-primary text-white hover:bg-primary-hover',
  }[variant]

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
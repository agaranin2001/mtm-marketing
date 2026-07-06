interface NavLink {
  label: string
  onClick: () => void
}

interface MobileNavOverlayProps {
  open: boolean
  links: NavLink[]
  country: { code: string, name: string }
  language: string
  onLanguageClick: () => void
  onLogin: () => void
  loginLabel: string
  onBookDemo: () => void
  bookDemoLabel: string
  ariaLabel?: string
}

/** Shared mobile nav overlay for the landing and knowledge-hub pages — only the links differ per page. */
export default function MobileNavOverlay({
  open,
  links,
  country,
  language,
  onLanguageClick,
  onLogin,
  loginLabel,
  onBookDemo,
  bookDemoLabel,
  ariaLabel,
}: MobileNavOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col pt-[88px] transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ff170033 0%, transparent 60%), linear-gradient(135deg, #070233 0%, #0a0240 50%, #2a0a14 100%)' }}
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
    >
      <nav className="flex flex-1 flex-col justify-center gap-2 px-4">
        {links.map(({ label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="cursor-pointer py-4 text-left text-[20px] font-medium text-white/80 transition-colors duration-200 hover:text-white"
          >
            {label}
          </button>
        ))}
        <button
          onClick={onLanguageClick}
          className="flex cursor-pointer items-center gap-2.5 py-4 text-left text-[20px] font-medium text-white/80 transition-colors duration-200 hover:text-white"
        >
          <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
            <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} className="h-full w-full object-cover" />
          </span>
          {country.name}
          {' · '}
          {language}
        </button>
      </nav>

      <div className="shrink-0 space-y-3 px-4 pb-6">
        <button
          onClick={onLogin}
          className="w-full cursor-pointer rounded-brand border border-white/30 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-white/10"
        >
          {loginLabel}
        </button>
        <button
          onClick={onBookDemo}
          className="w-full cursor-pointer rounded-brand bg-white py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-[#070233] transition-colors duration-200 hover:bg-[#2F9BFF] hover:text-white"
        >
          {bookDemoLabel}
        </button>
      </div>
    </div>
  )
}

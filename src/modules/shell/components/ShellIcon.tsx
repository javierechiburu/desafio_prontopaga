type ShellIconName =
  | 'dashboard'
  | 'transactions'
  | 'accounts'
  | 'settings'
  | 'search'
  | 'bell'
  | 'help'
  | 'download'
  | 'menu'

const ICON_PATHS: Record<ShellIconName, string[]> = {
  dashboard: ['M4 4h7v7H4z', 'M13 4h7v4h-7z', 'M13 10h7v10h-7z', 'M4 13h7v7H4z'],
  transactions: ['M6 7h12', 'M12 4l3 3-3 3', 'M18 17H6', 'M12 20l-3-3 3-3'],
  accounts: ['M4 9h16', 'M6 6h12', 'M6 9v7', 'M18 9v7', 'M4 16h16', 'M8 12h.01', 'M12 12h.01'],
  settings: [
    'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z',
    'M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1-1.4 1.4l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 1.4-1.4l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.1a1 1 0 0 0 .7.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H19a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.1a1 1 0 0 0-.9.7Z',
  ],
  search: ['M10.5 17a6.5 6.5 0 1 1 4.3-11.4A6.5 6.5 0 0 1 10.5 17Z', 'm16 16-3.7-3.7'],
  bell: ['M15 18H9', 'M18 15V11a6 6 0 1 0-12 0v4l-1.5 2h15Z'],
  help: ['M12 18h.01', 'M9.2 9a2.8 2.8 0 1 1 5 1.7c-.7.5-1.2 1-1.2 2.1'],
  download: ['M12 4v10', 'm8 11-8 8-8-8', 'M5 20h14'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
}

interface ShellIconProps {
  name: ShellIconName
  className?: string
}

export function ShellIcon({ name, className }: ShellIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}

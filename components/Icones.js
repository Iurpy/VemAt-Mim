// Ícones simples em SVG (traço), usados nas escolhas e nos cartões.
// aria-hidden: são decorativos, o texto ao lado já explica.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconeCasaCoracao(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11h14V9" />
      <path d="M12 17s-3-1.9-3-3.9A1.6 1.6 0 0 1 12 12a1.6 1.6 0 0 1 3 1.1c0 2-3 3.9-3 3.9z" />
    </svg>
  )
}

export function IconeMaleta(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  )
}

export function IconeFamilia(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M16 20v-.5a4.5 4.5 0 0 1 5-4.5" />
    </svg>
  )
}

export function IconePerfil(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  )
}

export function IconeSeta(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

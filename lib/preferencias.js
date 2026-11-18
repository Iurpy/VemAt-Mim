// Preferências de acessibilidade: tamanho da letra e alto contraste.
// Ficam guardadas no navegador e, para quem tem login, também no perfil.

const CHAVE = 'vam-preferencias'

export const TAMANHOS = [
  { valor: 1, nome: 'Normal' },
  { valor: 2, nome: 'Grande' },
  { valor: 3, nome: 'Muito grande' },
]

export function lerPreferencias() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null')
    if (salvo) return { tamanho: salvo.tamanho ?? 2, contraste: !!salvo.contraste }
  } catch {}
  return { tamanho: 2, contraste: false }
}

export function aplicarPreferencias({ tamanho, contraste }) {
  const html = document.documentElement
  html.dataset.fs = String(tamanho)
  html.dataset.contraste = contraste ? 'alto' : 'normal'
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ tamanho, contraste }))
  } catch {}
  window.dispatchEvent(new CustomEvent('preferencias-mudaram', { detail: { tamanho, contraste } }))
}

// Script que roda antes da página aparecer, para não "piscar" com a letra errada
export const scriptPreferencias = `
try {
  var p = JSON.parse(localStorage.getItem('${CHAVE}') || 'null');
  if (p) {
    document.documentElement.dataset.fs = String(p.tamanho || 2);
    document.documentElement.dataset.contraste = p.contraste ? 'alto' : 'normal';
  }
} catch (e) {}
`

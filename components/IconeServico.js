import { Droplets, Eye, Flower2, Footprints, Hand, Brush, Palette, Scissors, Sparkles, Wind } from 'lucide-react'

// Ícone e descrição curta de cada serviço do catálogo
const MAPA = {
  'Manicure': { Icone: Hand, curta: 'Mãos' },
  'Pedicure': { Icone: Footprints, curta: 'Pés' },
  'Manicure e pedicure': { Icone: Sparkles, curta: 'Mãos e pés' },
  'Esmaltação simples': { Icone: Droplets, curta: 'Só esmalte' },
  'Corte masculino': { Icone: Scissors, curta: 'Tesoura ou máquina' },
  'Barba': { Icone: Scissors, curta: 'Aparar e alinhar' },
  'Corte e barba': { Icone: Scissors, curta: 'Cabelo e barba' },
  'Corte feminino': { Icone: Scissors, curta: 'Corte e finalização' },
  'Escova': { Icone: Wind, curta: 'Lavar e escovar' },
  'Hidratação capilar': { Icone: Droplets, curta: 'Tratamento' },
  'Coloração': { Icone: Palette, curta: 'Tintura e raiz' },
  'Penteado': { Icone: Flower2, curta: 'Ocasiões especiais' },
  'Design de sobrancelha': { Icone: Eye, curta: 'Pinça ou linha' },
  'Maquiagem': { Icone: Brush, curta: 'Para eventos' },
}

export function infoServico(nome) {
  return MAPA[nome] ?? { Icone: Sparkles, curta: '' }
}

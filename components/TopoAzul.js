// Área azul do topo das telas (como no modelo). O conteúdo branco
// da página vem logo depois, dentro de <div className="folha">.
export default function TopoAzul({ children }) {
  return (
    <div className="topo-azul">
      <div className="coluna">{children}</div>
    </div>
  )
}

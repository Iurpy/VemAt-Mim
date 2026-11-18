// Campo de formulário com rótulo, texto de ajuda e mensagem de erro
// sempre ligados ao input (importante para leitores de tela).

export default function Campo({ id, rotulo, ajuda, erro, opcional, multilinha, ...props }) {
  const idAjuda = ajuda ? `${id}-ajuda` : null
  const idErro = erro ? `${id}-erro` : null
  const descricao = [idAjuda, idErro].filter(Boolean).join(' ') || undefined
  const Elemento = multilinha ? 'textarea' : 'input'

  return (
    <div className={`campo${erro ? ' com-erro' : ''}`}>
      <label htmlFor={id}>
        {rotulo}
        {opcional && <span className="opcional"> (opcional)</span>}
      </label>
      {ajuda && <p id={idAjuda} className="ajuda">{ajuda}</p>}
      <Elemento
        id={id}
        name={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao}
        {...props}
      />
      {erro && <p id={idErro} className="erro-campo">{erro}</p>}
    </div>
  )
}

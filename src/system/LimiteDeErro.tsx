import { Component, ReactNode } from "react";

// Error boundary. Existe porque um import() que falha VIRA ERRO DE RENDER, e sem
// alguem para segurar ele sobe ate o React Router, que troca A PAGINA INTEIRA
// pela tela crua "Unexpected Application Error!". Foi assim que o reCAPTCHA (um
// widget invisivel, opcional, que so serve no envio) derrubou a home e o /contato
// e fez o Google marcar soft 404.
//
// A regra que isto impoe: peca acessoria nao decide se a pagina existe.
//
// Precisa ser classe: nao ha equivalente em hook. So pega erro de RENDER dos
// filhos, nao de handler nem de promise solta.
interface Props {
  children: ReactNode;
  /** o que fica no lugar se o filho quebrar. Padrao: nada, some em silencio. */
  fallback?: ReactNode;
  /** avisa quem esta de fora (pra soltar um estado, medir, etc.) */
  aoFalhar?: (erro: Error) => void;
}

interface State {
  caiu: boolean;
}

class LimiteDeErro extends Component<Props, State> {
  state: State = { caiu: false };

  static getDerivedStateFromError(): State {
    return { caiu: true };
  }

  componentDidCatch(erro: Error) {
    this.props.aoFalhar?.(erro);
  }

  render() {
    if (this.state.caiu) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default LimiteDeErro;

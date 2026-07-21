import { useMemo, useState } from "react";

/**
 * 239-Selecionar Grade
 * Tela de seleção de grade/variação de produto dentro do fluxo de
 * Consulta de Estoque do PDV Go.
 *
 * Este componente é APENAS front-end: toda a navegação (seleção de
 * variação, paginação, menu lateral, botão "Continuar") é resolvida
 * em estado local. Não há chamadas de API — os dados vêm de um mock
 * (`MOCK_PRODUTOS`) que deve ser substituído pela integração real.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProdutoGrade {
  id: string;
  codigo: string;
  fornecedor: string;
  nome: string;
  variacao: string;
  preco: number;
  estoqueLoja: number;
  disponivel: number;
  previsaoChegada?: {
    data: string;
    pedido: string;
    qtd: number;
  };
}

// ---------------------------------------------------------------------------
// Mock data — troque pela resposta real da API de consulta de estoque
// ---------------------------------------------------------------------------

const MOCK_PRODUTOS: ProdutoGrade[] = [
  {
    id: "1",
    codigo: "028025",
    fornecedor: "FRITZ",
    nome: "GUARDA ROUPA BABY 2PTS PC",
    variacao: "BRANCO",
    preco: 279.0,
    estoqueLoja: 8,
    disponivel: 256,
    previsaoChegada: { data: "08/06/2026", pedido: "4500082169", qtd: 150 },
  },
  {
    id: "2",
    codigo: "29200929",
    fornecedor: "NOTAVEL",
    nome: "GUARDA ROUPA NT 6010",
    variacao: "FREIJO",
    preco: 569.97,
    estoqueLoja: 2,
    disponivel: 248,
  },
  {
    id: "3",
    codigo: "29200929",
    fornecedor: "NOTAVEL",
    nome: "GUARDA ROUPA NT 6010",
    variacao: "FREIJO/OFF WHITE",
    preco: 569.97,
    estoqueLoja: 0,
    disponivel: 200,
  },
  {
    id: "4",
    codigo: "033014",
    fornecedor: "IMOP",
    nome: "GUARDA ROUPA MEGA 6PTS C/PE",
    variacao: "BRANCO NEVE",
    preco: 498.99,
    estoqueLoja: 2,
    disponivel: 178,
  },
  {
    id: "5",
    codigo: "043057",
    fornecedor: "ACP",
    nome: "PECA DE GUARDA ROUPA ALAM 4PTS MOGNO",
    variacao: "UNICA",
    preco: 488.93,
    estoqueLoja: 2,
    disponivel: 163,
  },
  {
    id: "6",
    codigo: "043107",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA PRIMULA 3PTS C/ESPELHO PC",
    variacao: "BRANCO/AZUL/ROSA",
    preco: 812.12,
    estoqueLoja: 2,
    disponivel: 163,
    previsaoChegada: { data: "08/06/2026", pedido: "4500082169", qtd: 150 },
  },
  {
    id: "7",
    codigo: "043107",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA PRIMULA 3PTS C/ESPELHO PC",
    variacao: "BRANCO/BRANCO/MAPLE",
    preco: 812.12,
    estoqueLoja: 2,
    disponivel: 158,
  },
  {
    id: "8",
    codigo: "043107",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA PRIMULA 3PTS C/ESPELHO PC",
    variacao: "MARFIM",
    preco: 812.12,
    estoqueLoja: 2,
    disponivel: 156,
  },
  {
    id: "9",
    codigo: "043143",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA DUBAI 6PTS 2PTS C/ESPELHO",
    variacao: "BRANCO/PRETO",
    preco: 799.0,
    estoqueLoja: 2,
    disponivel: 150,
  },
  {
    id: "10",
    codigo: "043143",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA DUBAI 6PTS 2PTS C/ESPELHO",
    variacao: "CINZA/PRETO",
    preco: 799.0,
    estoqueLoja: 2,
    disponivel: 148,
  },
  {
    id: "11",
    codigo: "043143",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA DUBAI 6PTS 2PTS C/ESPELHO",
    variacao: "IMBUIA/PRETO",
    preco: 799.0,
    estoqueLoja: 2,
    disponivel: 148,
  },
  {
    id: "12",
    codigo: "043143",
    fornecedor: "ACP",
    nome: "GUARDA ROUPA DUBAI 6PTS 2PTS C/ESPELHO",
    variacao: "IPE/AMENDOA",
    preco: 799.0,
    estoqueLoja: 2,
    disponivel: 148,
  },
];

const TOTAL_PAGINAS = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5h14M3 10h14M3 15h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  // Mostra: 1, atual-1..atual+1 (dentro dos limites), "...", última página
  const pages = useMemo(() => {
    const set = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    return Array.from(set)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <nav
      className="flex w-full items-center justify-center"
      aria-label="Paginação de resultados"
    >
      <div className="flex items-center gap-1 rounded">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-[38px] w-10 items-center justify-center rounded text-[#3d3d3d] disabled:opacity-30"
          aria-label="Página anterior"
        >
          <IconChevronLeft />
        </button>

        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          const showGap = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center">
              {showGap && (
                <span className="flex h-[38px] w-10 items-center justify-center text-[16px] text-[#6d6d6d]">
                  ...
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`flex h-[38px] w-10 items-center justify-center rounded text-[16px] transition-colors ${
                  p === page
                    ? "bg-[#3d3d3d] text-white"
                    : "text-[#6d6d6d] hover:bg-[#f5f5f5]"
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-[38px] w-10 items-center justify-center rounded text-[#3d3d3d] disabled:opacity-30"
          aria-label="Próxima página"
        >
          <IconChevronRight />
        </button>
      </div>
    </nav>
  );
}

interface ConteinerProdutoProps {
  produto: ProdutoGrade;
  selecionado: boolean;
  onSelect: (id: string) => void;
}

function ConteinerProduto({ produto, selecionado, onSelect }: ConteinerProdutoProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(produto.id)}
      aria-pressed={selecionado}
      className={`flex w-full flex-col items-start gap-4 border-b border-[#e7e7e7] bg-white px-4 py-5 text-left transition-colors last:border-b-0 ${
        selecionado ? "bg-[#f9f9fa]" : "hover:bg-[#fafafa]"
      }`}
    >
      <div className="flex w-full items-center gap-2">
        {/* imagem (placeholder) */}
        <div className="size-[70px] shrink-0 overflow-hidden rounded-[4.773px] bg-[#eceff1]" />

        <div className="flex flex-1 flex-col gap-2 self-stretch">
          <div className="flex w-full items-start gap-2">
            <div className="flex flex-1 items-center gap-2">
              <span className="text-[14px] text-[#6d6d6d]">{produto.codigo}</span>
              <span className="flex h-[18px] items-center justify-center rounded border border-[#e7e7e7] px-[9px] text-[12px] text-[#6d6d6d]">
                {produto.fornecedor}
              </span>
            </div>
            <span className="whitespace-nowrap text-right text-[14px] text-[#6d6d6d]">
              {formatarPreco(produto.preco)}
            </span>
          </div>

          <p className="w-full text-[14px] font-medium leading-[1.25] text-[#262626]">
            {produto.nome}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`flex size-[18px] items-center justify-center rounded-full border-2 ${
                selecionado ? "border-[#e01d25]" : "border-[#b6bbbc]"
              }`}
            >
              {selecionado && (
                <span className="size-[9px] rounded-full bg-[#e01d25]" />
              )}
            </span>
            <span className="text-[14px] text-[#6d6d6d]">{produto.variacao}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between text-[14px]">
        <div className="flex items-center gap-2">
          <span className="text-[#6d6d6d]">Estoque Loja:</span>
          <span className="font-medium text-[#1c57b1]">{produto.estoqueLoja}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#6d6d6d]">Disponível:</span>
          <span className="font-medium text-[#1c57b1]">{produto.disponivel}</span>
        </div>
      </div>

      {produto.previsaoChegada && (
        <div className="flex w-full items-center gap-4 rounded-[10px] bg-[#f9f9fa] px-4 py-3">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2 text-[14px] font-medium text-[#3d3d3d]">
              <span>Previsão de Chegada:</span>
              <span>{produto.previsaoChegada.data}</span>
            </div>
            <div className="flex w-full items-center justify-between text-[14px] text-[#6d6d6d]">
              <div className="flex items-center gap-2">
                <span>Pedido</span>
                <span>{produto.previsaoChegada.pedido}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Qtd:</span>
                <span>{produto.previsaoChegada.qtd}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface SelecionarGradeProps {
  /** chamado quando o usuário confirma a variação selecionada */
  onContinuar?: (produto: ProdutoGrade) => void;
  /** chamado ao clicar em "voltar" na navegação superior, se houver */
  onVoltar?: () => void;
}

export default function SelecionarGrade({ onContinuar, onVoltar }: SelecionarGradeProps) {
  const [codigoProduto, setCodigoProduto] = useState("");
  const [descricaoProduto, setDescricaoProduto] = useState("Guarda Roupa");
  const [refFabricante, setRefFabricante] = useState("");

  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string | null>(
    null
  );
  const [pagina, setPagina] = useState(1);
  const [menuAberto, setMenuAberto] = useState(false);

  const produtoSelecionado = useMemo(
    () => MOCK_PRODUTOS.find((p) => p.id === produtoSelecionadoId) ?? null,
    [produtoSelecionadoId]
  );

  function handleConsultar() {
    // Front-end apenas: aqui entraria a chamada real de busca.
    // Por ora, reseta a paginação e a seleção para simular uma nova consulta.
    setPagina(1);
    setProdutoSelecionadoId(null);
  }

  function handleContinuar() {
    if (produtoSelecionado) onContinuar?.(produtoSelecionado);
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f5f5f5]">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <header className="flex h-[72px] w-full items-center bg-[#e01d25] px-6">
        <div className="flex w-full items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onVoltar?.();
            }}
            className="flex items-center gap-[3px] rounded bg-white px-[9px] py-3"
          >
            <span className="text-[11px] font-extrabold text-[#767676]">PDV</span>
            <span className="flex h-[13px] items-center justify-center rounded-full bg-[#e01d25] px-[2px] text-[11px] font-extrabold text-white">
              GO
            </span>
          </a>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 whitespace-nowrap text-[14px] text-white">
              <span className="font-medium">ingridtavora</span>
              <span className="opacity-90">•</span>
              <span className="opacity-90">O2 (PH)</span>
            </div>
            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
              className="flex size-10 items-center justify-center text-white"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Conteúdo principal                                               */}
      {/* ---------------------------------------------------------------- */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col items-start gap-6 p-6 pb-32">
        {/* Card de consulta */}
        <section className="flex w-full flex-col items-start overflow-hidden rounded border border-[#e7e7e7] bg-white shadow-[0px_6px_10px_0px_rgba(0,0,0,0.05)]">
          <div className="flex w-full items-center justify-center border-b border-[#e7e7e7] bg-[#f9f9fa] px-4 py-4">
            <p className="flex-1 text-[16px] font-medium leading-[1.5] text-[#262626]">
              Consultar Estoque
            </p>
          </div>

          <form
            className="flex w-full flex-col items-start gap-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleConsultar();
            }}
          >
            <label className="flex w-full flex-col items-start gap-2">
              <span className="text-[16px] text-[#29272b]">Código Produto:</span>
              <input
                value={codigoProduto}
                onChange={(e) => setCodigoProduto(e.target.value)}
                className="h-11 w-full rounded-[3px] border border-[#e7e7e7] bg-white px-2 py-3 text-[16px] text-[#262626] outline-none focus:border-[#4f4f4f]"
                placeholder="Digite o código"
              />
            </label>

            <label className="flex w-full flex-col items-start gap-2">
              <span className="text-[16px] text-[#29272b]">Descrição Produto:</span>
              <input
                value={descricaoProduto}
                onChange={(e) => setDescricaoProduto(e.target.value)}
                className="h-11 w-full rounded-[3px] border-2 border-[#4f4f4f] bg-white px-2 py-3 text-[16px] text-[#262626] outline-none"
                placeholder="Digite a descrição"
              />
            </label>

            <label className="flex w-full flex-col items-start gap-2">
              <span className="text-[16px] text-[#29272b]">Ref. Fabricante:</span>
              <input
                value={refFabricante}
                onChange={(e) => setRefFabricante(e.target.value)}
                className="h-11 w-full rounded-[3px] border border-[#e7e7e7] bg-white px-2 py-3 text-[16px] text-[#262626] outline-none focus:border-[#4f4f4f]"
                placeholder="Opcional"
              />
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded bg-[#6d6d6d] px-6 py-3 text-[16px] text-white transition-colors hover:bg-[#5a5a5a]"
            >
              Consultar
            </button>
          </form>
        </section>

        {/* Lista de grades */}
        <section className="flex w-full flex-col items-start gap-4">
          <p className="w-full text-[16px] font-medium leading-[1.5] text-[#4f4f4f]">
            A busca retornou {MOCK_PRODUTOS.length} registro(s).
          </p>

          <div className="flex w-full flex-col items-start overflow-hidden rounded border border-[#e7e7e7] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.05)]">
            {MOCK_PRODUTOS.map((produto) => (
              <ConteinerProduto
                key={produto.id}
                produto={produto}
                selecionado={produto.id === produtoSelecionadoId}
                onSelect={setProdutoSelecionadoId}
              />
            ))}
          </div>

          <Pagination page={pagina} totalPages={TOTAL_PAGINAS} onChange={setPagina} />
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* Barra inferior de preço / continuar                             */}
      {/* ---------------------------------------------------------------- */}
      {produtoSelecionado && (
        <div className="fixed inset-x-0 bottom-0 flex w-full justify-center border-t border-[#e7e7e7] bg-white px-6 py-6">
          <div className="flex w-full max-w-[480px] items-center gap-4">
            <div className="flex-1">
              <p className="text-[14px] text-[#6d6d6d]">Total</p>
              <p className="text-[20px] font-medium text-[#262626]">
                {formatarPreco(produtoSelecionado.preco)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleContinuar}
              className="flex flex-1 items-center justify-center rounded bg-[#e01d25] px-6 py-3 text-[16px] font-medium text-white transition-colors hover:bg-[#c81920]"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Menu lateral (drawer)                                            */}
      {/* ---------------------------------------------------------------- */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 bg-black/30"
          />
          <aside className="relative flex h-full w-[378px] max-w-[85vw] flex-col gap-8 overflow-y-auto bg-white px-6 py-8">
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar menu"
              className="absolute right-6 top-6 text-[#6d6d6d]"
            >
              <IconClose />
            </button>

            <div className="flex flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start">
                <span className="rounded bg-[#f9f9fa] px-[10px] py-[2px] text-[14px] text-[#29272b]">
                  Loja 02 | PH
                </span>
                <p className="mt-1 text-[24px] font-medium leading-[1.5] text-[#262626]">
                  Ingrid Ferreira Tavora
                </p>
                <p className="text-[16px] text-[#979797]">ingridtavora</p>
              </div>

              <div className="flex w-full items-center gap-2 rounded-lg bg-[#fff8ed] px-2 py-1">
                <div className="flex items-center p-2">
                  <div className="size-6 rounded-full bg-[#f5c46b]" />
                </div>
                <div className="flex items-center gap-2 text-[16px]">
                  <span className="text-[#262626]">Saldo desconto:</span>
                  <span className="font-medium text-[#482000]">R$ 4.000,00</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded border border-[#e7e7e7] bg-[#f7f8f8] px-6 py-3 text-[16px] text-[#262626] transition-colors hover:bg-[#eff0f0]"
            >
              Catálogo
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded border border-[#e7e7e7] bg-[#f7f8f8] px-6 py-3 text-[16px] text-[#262626] transition-colors hover:bg-[#eff0f0]"
            >
              Pesquisar mostruário
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

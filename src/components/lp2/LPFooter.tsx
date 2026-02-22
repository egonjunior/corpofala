import { CorpoFalaLogoMark } from "./CorpoFalaLogo";

const COLS = [
  {
    title: "PRODUTO",
    links: ["O Livro", "Experiência Interativa", "5 Dinâmicas", "Como Funciona"],
  },
  {
    title: "CONTA",
    links: ["Criar conta", "Entrar", "Meu Perfil", "Meu Mapa Pessoal"],
  },
  {
    title: "LEGAL",
    links: ["Política de Privacidade", "Termos de Uso", "Contato"],
  },
];

const LPFooter = () => (
  <footer className="bg-[#0D0B12]" style={{ padding: "64px max(32px, calc((100vw - 1200px) / 2))" }}>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
      {/* Brand */}
      <div className="col-span-2 lg:col-span-1">
        <CorpoFalaLogoMark iconSize={24} textClass="text-white/85" className="mb-4" />
        <p className="font-sans text-[13px] text-white/35 leading-[1.7] max-w-[200px]">
          Sistema completo de autoconhecimento somático em português.
        </p>
      </div>

      {/* Link columns */}
      {COLS.map((col) => (
        <div key={col.title}>
          <span className="font-mono text-[10px] text-white/30 tracking-[0.15em] block mb-4">{col.title}</span>
          <ul className="space-y-3">
            {col.links.map((link) => (
              <li key={link}>
                <a href="#" className="font-sans text-sm text-white/50 hover:text-white/80 transition-colors no-underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-white/[0.06] pt-8 mt-12">
      <p className="font-mono text-[11px] text-white/20 text-center">
        © 2026 CorpoFala · Egon Junior Gotchalk
        <br />
        Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default LPFooter;

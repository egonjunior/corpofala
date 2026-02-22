const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          <strong className="text-foreground">Aviso importante:</strong> Este livro não 
          substitui acompanhamento médico ou psicológico profissional. Se você está em 
          sofrimento emocional, procure ajuda.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span>
            <strong>CVV:</strong> 188 (24h)
          </span>
          <span>
            <strong>SAMU:</strong> 192
          </span>
          <span>
            <strong>Bombeiros:</strong> 193
          </span>
        </div>

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} O Que Seu Corpo Está Tentando Te Dizer. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

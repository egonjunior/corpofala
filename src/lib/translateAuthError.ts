/**
 * Traduz mensagens de erro do Supabase Auth para português amigável.
 */
export function translateAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("too many requests"))
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";

  if (lower.includes("already registered") || lower.includes("already been registered"))
    return "Este e-mail já está cadastrado. Tente entrar.";

  if (lower.includes("invalid login credentials"))
    return "E-mail ou senha incorretos.";

  if (lower.includes("password should be at least") || lower.includes("password is too short"))
    return "A senha precisa ter pelo menos 8 caracteres.";

  if (lower.includes("email not confirmed") || lower.includes("email_not_confirmed"))
    return "Sua conta ainda está sendo processada. Tente novamente em instantes.";

  if (lower.includes("invalid email"))
    return "E-mail inválido. Verifique e tente novamente.";

  if (lower.includes("signup is disabled"))
    return "Novos cadastros estão temporariamente desativados.";

  if (lower.includes("network") || lower.includes("fetch"))
    return "Erro de conexão. Verifique sua internet e tente novamente.";

  return "Ocorreu um erro. Tente novamente em alguns instantes.";
}

export function isRateLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("rate limit") || lower.includes("too many requests");
}

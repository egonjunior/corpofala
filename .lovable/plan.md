
## Raiz dos Problemas

### Bug 1 — Race condition no login (crítico)
O `AppLogin.tsx` navega para `/app/dashboard` imediatamente após o `signInWithPassword`. Nesse momento, o `AuthContext` ainda está buscando o `access_status` no banco (`accessLoading: true`). O `AccessGuard` retorna `null` enquanto carrega. Quando o carregamento termina, há uma janela onde `accessStatus` pode ser interpretado como não-ativo, redirecionando o usuário para `/app/acesso-pendente` erroneamente.

**Solução:** O `AppLogin` não deve navegar diretamente. O `AuthContext` já escuta mudanças de sessão via `onAuthStateChange`. Basta remover a navegação do login e deixar o `AccessGuard` ou um `useEffect` no próprio contexto tratar o redirecionamento após o carregamento completo.

Alternativa mais simples e cirúrgica: no `AppLogin`, após o login bem-sucedido, navegar para `/app/dashboard` mas o `AccessGuard` aguardar que `adminLoading` também seja resolvido antes de redirecionar para `/app/acesso-pendente`.

### Bug 2 — email_queue vazia para o usuário
A tabela `email_queue` não tem nenhum registro para `egonjuniorg@gmail.com`. Isso significa que o webhook provavelmente rodou antes do usuário criar a conta (ou usou um email ligeiramente diferente), então o `profileData?.user_id` era `null` na hora do insert. Ou o webhook falhou silenciosamente.

**Solução:** Inserir manualmente os emails 2–6 na fila para esse usuário e verificar o webhook.

### Bug 3 — `AccessGuard` não aguarda `adminLoading`
O guard atual verifica `loading || accessLoading` mas não inclui `adminLoading`. Isso cria uma janela onde `isAdmin` ainda é `false` (carregando) e `accessStatus` ainda não foi definido, podendo redirecionar incorretamente.

---

## Plano de Correção

### Arquivo 1: `src/App.tsx` — AccessGuard
Adicionar `adminLoading` na condição de espera do guard:

```
if (loading || accessLoading || adminLoading) return null;
```

Isso garante que nenhuma decisão de roteamento seja tomada enquanto qualquer estado de autenticação ainda está sendo resolvido.

### Arquivo 2: `src/pages/app/AppLogin.tsx` — Remoção da navegação prematura
Remover a navegação direta após o login. Em vez disso, usar um `useEffect` que observa `user`, `accessLoading` e `accessStatus` para só navegar quando o estado estiver completamente resolvido:

```
useEffect(() => {
  if (!user || accessLoading) return;
  if (accessStatus === "active") {
    const welcomeSeen = localStorage.getItem("welcomeSeen") === "true";
    navigate(welcomeSeen ? "/app/dashboard" : "/app/bemvindo");
  } else if (accessStatus === "pending") {
    navigate("/app/acesso-pendente");
  }
}, [user, accessStatus, accessLoading]);
```

Isso elimina completamente a race condition.

### Ação manual — email_queue
Após a correção de código, inserir via SQL os emails 2–6 para `egonjuniorg@gmail.com` na fila (com `scheduled_at` calculado a partir da data de criação do perfil: `2026-02-20 02:43:21`).

---

## Impacto
- Todos os novos usuários que fizerem login após o pagamento serão corretamente redirecionados para o dashboard
- O `egonjuniorg@gmail.com` já tem `access_status: active` no banco, então após a correção o próximo login dele funcionará normalmente
- A race condition que provavelmente afeta **todos os usuários pagantes** no primeiro login será eliminada

# CP1 — React Native Chat com Firebase

Aplicativo de chat **1 para 1** desenvolvido em React Native + TypeScript com Expo SDK 55, Firebase Authentication e Firebase Realtime Database.

## Integrante

- **RM554606 — Guilherme Gomes Oliveira**

## Requisitos implementados

- React Native + Expo SDK 55 + TypeScript estrito.
- Firebase Authentication com E-mail/Senha, Google e Apple.
- Firebase Realtime Database (não utiliza Cloud Firestore).
- Chat exclusivamente entre duas pessoas.
- Regra de compatibilidade: E-mail/Senha ↔ Google ou Apple.
- Bloqueio de E-mail ↔ E-mail, Google ↔ Google, Apple ↔ Apple e Google ↔ Apple.
- Atualização de mensagens em tempo real usando listeners `onValue` com remoção correta.
- Loading, erros, estado sem contatos e estado sem mensagens.
- Hooks `useState`, `useEffect`, `useMemo` e `useCallback` com uso funcional.
- Componentização, contexts, hooks e services separados.
- Código sem uso de `any`.
- Regras de segurança do Realtime Database versionadas em `firebase/database.rules.json`.

## Tecnologias

- Expo SDK 55
- React Native 0.83
- React 19.2
- TypeScript
- Firebase Authentication
- Firebase Realtime Database
- Expo AuthSession
- Expo Apple Authentication
- Expo Crypto

## Firebase

Projeto configurado: `cp-1-mobile`.

```text
users/{uid}
conversations/{conversationId}
messages/{conversationId}/{messageId}
```

## Regra de comunicação

| Usuário A | Usuário B | Permitido |
|---|---|---|
| E-mail/Senha | Google | ✅ |
| E-mail/Senha | Apple | ✅ |
| E-mail/Senha | E-mail/Senha | ❌ |
| Google | Google | ❌ |
| Apple | Apple | ❌ |
| Google | Apple | ❌ |

## Como executar

Requisitos: Node.js 20.19+ e npm.

```bash
npm install
npx expo install --fix
npm run typecheck
npm start
```

Para execução nativa:

```bash
npx expo prebuild --clean
npm run android
# ou em macOS
npm run ios
```

> O login Apple aparece somente no iOS quando o recurso está disponível.

## Google Sign-In no Android

O app Android usa `com.guig3003.cp1chatfirebase` e inclui `google-services.json`. Para uma build Android de produção, cadastre no Firebase o SHA-1 do certificado usado pela build e baixe novamente o arquivo caso o OAuth Client Android ainda não esteja presente.

## Apple Sign-In

O app iOS usa `com.guig3003.cp1chatfirebase`, `usesAppleSignIn: true` e o plugin `expo-apple-authentication`. Em builds assinadas, a capability **Sign in with Apple** deve estar habilitada na conta Apple Developer/EAS.

## Telas

1. Login/Cadastro com E-mail/Senha, Google e Apple.
2. Usuários, exibindo somente contatos compatíveis.
3. Chat com mensagens enviadas/recebidas diferenciadas e atualização em tempo real.

## Prints da aplicação

Após executar em dispositivo/emulador, adicione os prints finais em `docs/screenshots/` e referencie-os neste README antes da entrega no Teams.

## Segurança

As regras de produção estão em `firebase/database.rules.json`. Não utilize regras globais abertas (`.read: true` / `.write: true`).

## Entrega

Repositório destinado à entrega do **CheckPoint 1 - Chat** via Microsoft Teams.

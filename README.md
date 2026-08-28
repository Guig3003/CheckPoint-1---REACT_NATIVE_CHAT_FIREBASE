# CP1 - React Native Chat com Firebase

Aplicativo de chat **1 para 1** desenvolvido em React Native + TypeScript com Expo SDK 55, Firebase Authentication e Firebase Realtime Database.

## Integrante

- **RM554606 - Guilherme Gomes Oliveira**

## Requisitos implementados

- React Native + Expo SDK 55 + TypeScript estrito.
- Firebase Authentication com E-mail/Senha, Google e Apple.
- Firebase Realtime Database (nao utiliza Cloud Firestore).
- Chat exclusivamente entre duas pessoas.
- Regra de compatibilidade: E-mail/Senha <-> Google ou Apple.
- Bloqueio de E-mail <-> E-mail, Google <-> Google, Apple <-> Apple e Google <-> Apple.
- Atualizacao de mensagens em tempo real usando listeners `onValue` com remocao correta.
- Loading, erros, estado sem contatos e estado sem mensagens.
- Hooks `useState`, `useEffect`, `useMemo` e `useCallback` com uso funcional.
- Componentizacao, contexts, hooks e services separados.
- Codigo sem uso de `any`.
- Regras de seguranca do Realtime Database versionadas em `firebase/database.rules.json`.

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

## Regra de comunicacao

| Usuario A | Usuario B | Permitido |
|---|---|---|
| E-mail/Senha | Google | Sim |
| E-mail/Senha | Apple | Sim |
| E-mail/Senha | E-mail/Senha | sim |
| Google | Google | Nao |
| Apple | Apple | Nao |
| Google | Apple | Nao |

## Como executar

Requisitos: Node.js 20.19+ e npm.

```bash
npm install
npx expo install --fix
npm run typecheck
npm start
```

Para execucao nativa:

```bash
npx expo prebuild --clean
npm run android
# ou em macOS
npm run ios
```

> O login Apple aparece somente no iOS quando o recurso esta disponivel.

## Google Sign-In no Android

O app Android usa `com.guig3003.cp1chatfirebase` e inclui `google-services.json`. Para uma build Android de producao, cadastre no Firebase o SHA-1 do certificado usado pela build e baixe novamente o arquivo caso o OAuth Client Android ainda nao esteja presente.

## Apple Sign-In

O app iOS usa `com.guig3003.cp1chatfirebase`, `usesAppleSignIn: true` e o plugin `expo-apple-authentication`. Em builds assinadas, a capability **Sign in with Apple** deve estar habilitada na conta Apple Developer/EAS.

## Telas

1. Login/Cadastro com E-mail/Senha, Google e Apple.
2. Usuarios, exibindo somente contatos compativeis.
3. Chat com mensagens enviadas/recebidas diferenciadas e atualizacao em tempo real.

## Prints da aplicacao

Os prints abaixo demonstram o resultado final executado no emulador Android e validam os principais requisitos da entrega.

### Cadastro com E-mail/Senha

![Cadastro com e-mail e senha](docs/screenshots/cadastro-email-senha.jpeg)

A tela de autenticacao permite criar conta usando nome, e-mail e senha. Esse fluxo atende ao requisito de Firebase Authentication com E-mail/Senha e prepara o usuario para ser registrado no Realtime Database.

### Login com Google

![Fluxo de login com Google](docs/screenshots/login-google-chrome.jpeg)

O fluxo de login social abre a autenticacao do Google no navegador do Android. Esse print evidencia a integracao com provedor Google, conforme solicitado nos requisitos de autenticacao.

### Lista de contatos compativeis

![Lista sem contatos compativeis](docs/screenshots/contatos-sem-compativeis.jpeg)

A tela de contatos mostra o usuario autenticado e informa que nao ha contato compativel no momento. O resultado esta correto porque a regra do app permite conversa apenas entre contas E-mail/Senha e Google ou Apple. Quando nao existe outro usuario com provedor compativel cadastrado no banco, a aplicacao exibe o estado vazio em vez de liberar conversas invalidas.

## Resultado conforme os requisitos

O projeto entrega um chat 1 para 1 com autenticacao pelo Firebase e persistencia no Firebase Realtime Database. A regra de comunicacao foi aplicada para que usuarios so consigam conversar quando a combinacao de provedores for valida: E-mail/Senha com Google ou E-mail/Senha com Apple.

Na execucao mostrada pelos prints, o cadastro por E-mail/Senha funciona, o fluxo de Google Sign-In e iniciado corretamente e a listagem de contatos respeita a regra de compatibilidade. Como nao havia contato Google ou Apple disponivel para o usuario E-mail/Senha logado, o aplicativo exibiu o estado "Nenhum contato compativel", demonstrando o bloqueio das combinacoes nao permitidas.

## Seguranca

As regras de producao estao em `firebase/database.rules.json`. Nao utilize regras globais abertas (`.read: true` / `.write: true`).

## Entrega

Repositorio destinado a entrega do **CheckPoint 1 - Chat** via Microsoft Teams.

# Mobile Password Generator

Aplicativo para gerar e armazenar senhas de forma segura, com isolamento de dados por usuário. O projeto roda com React Native via Expo no frontend, Spring Boot no backend, PostgreSQL como banco, tudo containerizado com Docker.

## Pré-requisitos

Você vai precisar dessas ferramentas instaladas:

- Node.js (versão 16+) - https://nodejs.org/
- npm (vem junto com Node.js)
- Docker e Docker Compose - https://www.docker.com/products/docker-desktop
- Java JDK (versão 11+) - https://www.oracle.com/java/technologies/downloads/
- Git - https://git-scm.com/
- Android Studio com emulador configurado (opcional, apenas para testar no Android)

Para verificar se tudo está instalado:

```powershell
node --version
npm --version
docker --version
java -version
```
## Configuração inicial

Clone o repositório e acesse a pasta:

```powershell
git clone [URL_DO_SEU_REPOSITORIO]
cd MobilePasswordGenerator
```

Instale as dependências do Node:

```powershell
npm install
```

## Subindo o backend e banco com Docker

O Docker Compose já está configurado para rodar backend e PostgreSQL. Na pasta raiz do projeto, execute:

```powershell
docker compose up -d --build backend
```

Isso vai:
- Construir a imagem do backend (Spring Boot)
- Criar e iniciar o container do PostgreSQL
- Iniciar o container do backend
- Rodar tudo em background (-d)

Para verificar se ficou tudo rodando:

```powershell
docker compose ps
```

Você deve ver dois containers com status "Up". Se algo der errado, veja os logs:

```powershell
docker compose logs backend
```

O backend estará acessível em http://localhost:8080/api (quando rodando local no PC).

## Executando o frontend no Expo Web

Para testar rápido no navegador, use:

```powershell
npm run web
```

A aplicação vai abrir automaticamente no navegador em http://localhost:19006. Se não abrir, acesse manualmente.

A detecção de URL é automática - o app vai usar http://localhost:8080/api quando rodando no web.

## Executando o frontend no Emulador Android

Se você quer testar no Android como seria em um celular de verdade:

Primeiro, configure o emulador no Android Studio:
1. Abra Android Studio
2. Em Device Manager, crie um novo Virtual Device (Pixel 5, Android 13+)
3. Inicie o emulador com o botão Play

Depois, em um novo terminal:

```powershell
npm run android
```

O Expo detecta o emulador rodando e compila o app para ele. Na primeira vez demora um pouco.

Durante o desenvolvimento, você pode recarregar o app:
- Pressione 'r' para fast refresh
- Pressione 'R' para hard reload
- Pressione 'i' para iOS (se configurado)

Importante: O app automaticamente usa http://10.0.2.2:8080/api quando detecta que está rodando em Android, porque localhost não funciona do emulador.

## Testando se tudo funciona

Para validar que backend, frontend e banco estão conversando:

1. Certifique-se que Docker está rodando com `docker compose ps`

2. Certifique-se que pelo menos um dos frontends está rodando (web ou android)

3. Na tela de login, crie uma nova conta com:
   - Nome: qualquer coisa
   - Email: seu@email.com
   - Senha: precisa ter maiúscula, número e caractere especial (exemplo: SenhaSegura123!)

4. Se o cadastro funcionou, você é redirecionado para login. Faça login com a mesma conta.

5. Na tela principal, gere uma senha e salve com um nome de app.

6. Acesse o histórico e veja a senha lá.

7. Faça logout (botão Sair).

## Problemas comuns

- "docker: command not found": instale Docker Desktop e reinicie o terminal.
- "docker-compose: command not found": use `docker compose`.
- Porta 8080 ocupada: pare os containers com `docker compose down` ou identify o processo com `netstat -ano | findstr :8080`.
- "Network request failed":
  - Web: use `http://localhost:8080/api`
  - Android emulator: use `http://10.0.2.2:8080/api`
  - Celular físico: use o IP da sua máquina.
- Dependências: `npm install`; se falhar, apague `node_modules` e `package-lock.json` e reinstale.
- Backend Docker travado: veja `docker compose logs -f backend` e reconstrua com `docker compose down && docker compose up -d --build backend`.
- Emulador Android não inicia: abra o Device Manager no Android Studio e inicie o virtual device.
- SafeAreaView warning: aviso só, não bloqueia.

## Resumo de comandos

```powershell
git clone [repositorio]
cd MobilePasswordGenerator
npm install
docker compose up -d --build backend
```

```powershell
npm run web
# ou
npm run android
```

```powershell
docker compose down
# Ctrl+C no terminal do Expo para parar o frontend
```
## Info importante

A URL da API é detectada automaticamente conforme o contexto:
- Web: http://localhost:8080/api
- Android: http://10.0.2.2:8080/api
- Celular/outro: configure em services/api.js ou EXPO_PUBLIC_API_URL


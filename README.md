# Mobile Password Generator

Aplicativo mobile para gerar e armazenar senhas, com frontend em React Native/Expo, backend em Spring Boot e banco PostgreSQL.

## Pré-requisitos

- Node.js e npm
- Docker e Docker Compose
- Java JDK
- Android Studio com um emulador Android configurado

## Instalação

```bash
npm install
```

## Execução Com Docker

Suba banco, backend e Metro/Expo:

```bash
docker compose up --build
```

Serviços principais:

- Backend: `http://localhost:8080/api`
- Metro/Expo: `http://localhost:8081`
- PostgreSQL exposto no host pela porta `5433`

## Android Studio E Emulador

O projeto está configurado principalmente para rodar no emulador do Android Studio.

Fluxo recomendado:

1. Abra o Android Studio.
2. Inicie um emulador em Device Manager.
3. Rode o projeto com Docker:

```bash
docker compose up --build
```

4. Abra o app pelo Expo Go no emulador usando:

```text
exp://10.0.2.2:8081
```

No Android Emulator, `10.0.2.2` aponta para a máquina host. Por isso o `docker-compose.yml` já vem configurado com:

```yaml
EXPO_PUBLIC_API_URL: http://10.0.2.2:8080/api
REACT_NATIVE_PACKAGER_HOSTNAME: 10.0.2.2
```

## Quando Trocar O IP

Se você rodar em outro tipo de emulador ou em um celular físico, talvez precise trocar o IP no serviço `mobile` do `docker-compose.yml`.

Troque estes dois valores:

```yaml
EXPO_PUBLIC_API_URL: http://10.0.2.2:8080/api
REACT_NATIVE_PACKAGER_HOSTNAME: 10.0.2.2
```

Use:

- `10.0.2.2` para Android Emulator do Android Studio
- IP LAN da sua máquina para celular físico na mesma rede
- IP específico do seu emulador se ele não usar o padrão do Android Studio

Depois de trocar o IP, reconstrua o container mobile:

```bash
docker compose build --no-cache mobile
docker compose up --force-recreate mobile
```

## Execução Local Sem Docker No Frontend

Também é possível rodar só o backend/banco no Docker e iniciar o Expo localmente:

```bash
docker compose up -d --build backend
npm run android
```

Nesse modo, o Expo usa a configuração do seu ambiente local.

## Comandos Úteis

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f mobile
docker compose down
```

## Problemas Comuns

- Se o app não conectar no backend pelo emulador, confira se `EXPO_PUBLIC_API_URL` está apontando para `http://10.0.2.2:8080/api`.
- Se estiver usando celular físico, substitua `10.0.2.2` pelo IP LAN da sua máquina.
- Se mudar variáveis `EXPO_PUBLIC_*`, reconstrua o container mobile.
- Se a porta `8080` estiver ocupada, pare o processo que usa a porta ou altere o mapeamento no Docker Compose.

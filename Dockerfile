FROM node:20.19.4

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    libnspr4 \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

RUN if [ -f /app/node_modules/expo/node_modules/@react-native/debugger-shell/bin/react-native-devtools ]; then \
      printf '#!/bin/sh\nexit 0\n' > /app/node_modules/expo/node_modules/@react-native/debugger-shell/bin/react-native-devtools && \
      chmod +x /app/node_modules/expo/node_modules/@react-native/debugger-shell/bin/react-native-devtools; \
    fi

COPY . .

ENV EXPO_NO_TELEMETRY=1
ENV BROWSER=none

EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npx", "expo", "start", "--host", "lan", "--port", "8081"]

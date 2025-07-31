# --- Estágio de Build ---
# Use uma imagem base oficial do Node.js LTS para o build
FROM node:18-alpine AS builder

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de definição de pacotes
COPY package.json package-lock.json* ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Defina as opções do Node.js e rode o build
# A opção GENERATE_SOURCEMAP=false é passada diretamente no comando
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build -- --no-generate-sourcemap

# --- Estágio de Produção ---
# Use uma imagem oficial do Nginx
FROM nginx:stable-alpine

# Copie os arquivos estáticos buildados do estágio anterior para o diretório padrão do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copie uma configuração personalizada do Nginx (opcional, mas recomendado para SPAs)
# Se você tiver um arquivo nginx.conf personalizado, copie-o aqui:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta 80 (padrão do Nginx)
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
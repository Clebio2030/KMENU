# Use uma imagem base oficial do Node.js LTS (Long Term Support)
FROM node:18-alpine AS builder

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de definição de pacotes
COPY package.json package-lock.json* ./

# Instale as dependências de produção
# Use 'npm ci' para garantir instalações consistentes baseadas no package-lock.json
RUN npm ci --only=production

# Copie o restante do código da aplicação
COPY . .

# Compile o código TypeScript para JavaScript
RUN npm run build

# --- Estágio de Produção ---
FROM node:18-alpine

WORKDIR /app

# Copie as dependências de produção do estágio de build
COPY --from=builder /app/node_modules ./node_modules

# Copie a aplicação compilada do estágio de build
COPY --from=builder /app/dist ./dist

# Copie package.json para referência (opcional, mas útil)
COPY package.json .

# Exponha a porta que a aplicação usa (definida no .env como 4010)
EXPOSE 4010

# Defina variáveis de ambiente padrão (podem ser sobrescritas pelo docker-compose)
ENV NODE_ENV=production
ENV PORT=4010

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]

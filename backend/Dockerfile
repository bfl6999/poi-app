FROM node:20-slim

# Establece el directorio de trabajo
WORKDIR /app

# Instala actualizaciones de seguridad del sistema
RUN apt-get update && apt-get upgrade -y && apt-get clean

# Copia los archivos
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Copia el resto de la app
COPY . .

# Expone el puerto de tu app
EXPOSE 3000

# Inicia el servidor
CMD ["node", "server.js"]
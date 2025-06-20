# Базовый образ
FROM node:18

# Рабочая директория внутри контейнера
WORKDIR /src

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Порт, который будет слушать сервер (если ты используешь, например, express)
EXPOSE 5731

# Команда запуска
CMD ["npm", "run", "start"]

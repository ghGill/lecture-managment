# 
FROM node:16

# working directory
WORKDIR /app

# 
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# command to run the app
CMD ["npm",  "start"]


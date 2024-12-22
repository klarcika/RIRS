# 1. Uporabite osnovno sliko Node.js
FROM node:18-alpine

# 2. Nastavite delovni imenik v sliki
WORKDIR /app

# 3. Kopirajte package.json in package-lock.json
COPY package*.json ./

# 4. Namestite odvisnosti
RUN npm install

# 5. Kopirajte preostale datoteke aplikacije
COPY . .

# 6. Preverite, ali je aplikacija pripravljena za gradnjo (React)
RUN npm run build

# 7. Nastavite ukaz za zagon aplikacije (za razvojni način)
CMD ["npm", "start"]

# 8. Odprto pristanišče
EXPOSE 3000

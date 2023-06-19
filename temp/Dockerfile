FROM python:3.11.4-alpine3.17
FROM node:18-alpine

# Set the working directory to /app inside the container
WORKDIR /dreamTeller
# Copy app files
COPY . .

# frontend
WORKDIR /dreamTeller/frontend
RUN npm install
# build react app
RUN npm run build

# backend
WORKDIR /dreamTeller/backend
# RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
# RUN yarn install --frozen-lockfile
# RUN npx prisma generate --schema=./db/prisma/schema.prisma

# ==== RUN =======
# Expose the port on which the app will be running
EXPOSE 5000
# Start the app
CMD [ "python", "main.py" ]
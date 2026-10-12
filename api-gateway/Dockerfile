# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN npm install --save @opentelemetry/api
RUN npm install --save @opentelemetry/auto-instrumentations-node

# Install app dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

EXPOSE 8000
# Set the command to start the app
# CMD [ "npm", "start" ]
CMD ["node", "--require", "@opentelemetry/auto-instrumentations-node/register", "index.js"]

FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install OpenTelemetry + Winston instrumentation (if not already in package.json)
RUN npm install --save \
    @opentelemetry/api \
    @opentelemetry/auto-instrumentations-node \
    @opentelemetry/winston-transport \
    @opentelemetry/instrumentation-winston

# Copy application source
COPY . .

# Expose app port
EXPOSE 8001

# Start application with New Relic + OpenTelemetry auto instrumentation
CMD ["node", "--require", "@opentelemetry/auto-instrumentations-node/register", "index.js"]


# FROM node:18-alpine

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install
# # If you are building your code for production
# # RUN npm ci --only=production

# # Bundle app source
# COPY . .

# ENV NEW_RELIC_APP_NAME=CEQ-CART-APPLICATION

# ENV NEW_RELIC_LICENSE_KEY=306fbf27d1aedc5151b8035e9d50cbbeFFFFNRAL

# EXPOSE 8001

# # CMD [ "node", "index.js" ]

# CMD [ "node", "-r", "newrelic",  "index.js" ]
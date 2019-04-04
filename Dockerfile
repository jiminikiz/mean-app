FROM keymetrics/pm2:latest-alpine

EXPOSE 8888

WORKDIR /app

RUN apk add --no-cache git python make g++

# COPY source files
COPY . .

# INSTALL dependencies
ENV NPM_CONFIG_LOGLEVEL error
RUN npm install --production

# SHOW current folder structure in logs
# RUN ls -al -R

# CMD [ "pm2-runtime", "start", "process.json" ]
CMD ["npm", "run", "dev"]
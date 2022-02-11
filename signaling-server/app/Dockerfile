FROM node:16-alpine

# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install

# copy the generated modules and all other files to the container
COPY . .

# expose the app running port
EXPOSE 8000

# the command that starts our app
CMD ["npm", "start"]

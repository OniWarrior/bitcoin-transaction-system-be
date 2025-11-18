# use debian based image node.js to ensure compatibility with nginx

# step 1: set os 
FROM node:18-bullseye    


# set working directory for the application within the image
WORKDIR /app

# copy the package.json and package-lock.json files to install deps
COPY package*.json ./  
RUN npm install   


# copy the remaining application files
COPY . .  

# install NGINX since we're using a debian based node image
RUN apt-get update && apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/* 

# copy the nginx configuration file into the container
COPY nginx.conf /etc/nginx/nginx.conf  

# expose the necessary ports for NGINX and API
EXPOSE 80 5000

ENV PORT=5000

# Start NGINX and the API
CMD ["bash","-lc","npm start & exec nginx -g 'daemon off;'"]
FROM node:argon

# Install gem sass for  grunt-contrib-sass
RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install -y ruby \
    ruby-dev 

RUN gem install sass

WORKDIR /home/mean

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g gulp

# Install Mean.JS packages
ADD package.json ./package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc ./.bowerrc
ADD bower.json ./bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . .

# Set development environment as default
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
CMD gulp
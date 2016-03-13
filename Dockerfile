# Dockerfile extending the generic Node image with application files for a
# single application.
FROM gcr.io/google_appengine/nodejs
# Install required system libraries to build qrcode/node-canvas library
RUN apt-get update -y && apt-get install --no-install-recommends -y -q \
    pkg-config libcairo2-dev libpango1.0-dev libgif-dev && \
    apt-get clean && rm /var/lib/apt/lists/*_*
# Copy over the source folder
COPY . /app/
# Switch to development environment (so that the package can be build on the server)
# and all required dependencies will be downloaded for building.
ENV NODE_ENV development
# Install all dependencies (will also install devDependencies) and build the
# package (via its postinstall script).
RUN npm install --unsafe-perm
#|| \
#  ((if [ -f npm-debug.log ]; then \
#      cat npm-debug.log; \
#    fi) && false)
# RUN ./node_modules/.bin/gulp build
# Switch node to production mode for running
ENV NODE_ENV production
# Delete all node packages, that are not required in production mode
RUN npm prune
# Check to see if the the version included in the base runtime satisfies
# 4.4.0, if not then do an npm install of the latest available
# version that satisfies it.
RUN /usr/local/bin/install_node 4.4.0
CMD npm start

# Step 1: Build Stage
# Use a lightweight Node.js image to build the app
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
# This uses Docker's layer caching to speed up future builds
COPY package.json package-lock.json ./

# Install dependencies (frozen-lockfile ensures consistent versions)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Pass build-time environment variables for Vite
# These must match the names in your .env file
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Assign build args to environment variables so Vite can bake them into the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the application for production
RUN npm run build

# Step 2: Production Stage
# Use the ultra-lightweight Nginx Alpine image to serve the files
FROM nginx:alpine

# Copy the built files from the 'build' stage into Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config to handle React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Inform Docker that the container listens on port 80
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]

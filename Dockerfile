# Use a Bun base image
FROM oven/bun:1.1.13-alpine

WORKDIR /app
COPY . .

RUN bun add -g @angular/cli

RUN bun install

EXPOSE 4200
CMD ["bunx", "ng", "serve", "--host", "0.0.0.0"]

FROM oven/bun:1

WORKDIR /app

COPY bun.lock bun.lock
COPY bunfig.toml bunfig.toml
COPY package.json package.json

RUN bun install

COPY . .

CMD ["bun", "run", "dev"]

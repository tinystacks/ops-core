FROM jarredsumner/bun:edge

ENV NODE_ENV=production
ENV PORT=8000

WORKDIR /app

COPY . .

RUN bun install --verbose
RUN bun run build
RUN bun run prod-install


EXPOSE 8000
CMD ["bun", "start"]
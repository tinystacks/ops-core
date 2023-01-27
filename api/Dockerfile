FROM public.ecr.aws/docker/library/node:18-slim

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ENV PORT=8000

WORKDIR /app

COPY . .

RUN npm run clean-build
RUN npm prune --production


EXPOSE 8000
CMD ["npm", "start"]
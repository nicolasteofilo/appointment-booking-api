import cors from "@fastify/cors";
import { fastify } from "fastify";

const app = fastify();

app.register(cors, {
	origin: true,
});

export { app };

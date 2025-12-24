import { buildApp } from "@/infrastructure/http/build-app";
import { authRoutes } from "@/infrastructure/http/routes/auth.routes";

const app = buildApp();
app.register(authRoutes, { prefix: "/auth" });

export { app };

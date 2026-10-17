import "dotenv/config";
import { app } from "./app";
import { connectDatabase } from "./config/db";

const port = Number(process.env.PORT) || 4000;

async function startServer(): Promise<void> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  connectDatabase().catch((error: unknown) => {
    console.error("Unable to connect to MongoDB during startup", error);
  });
}

startServer().catch((error: unknown) => {
  console.error("Unable to start server", error);
  process.exit(1);
});


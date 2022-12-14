import { connectToDB } from "services/database";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";
import {
  authRouter,
  eventRouter,
  organizationRouter,
  eventRegistrationRouter,
} from "routes/index";
import { userRouter } from "routes/users";

// setup the express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
// load .env
config();
setupServer();

async function setupServer() {
  try {
    app.get("/api", (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).json({
        message: "You are on the home endpoint",
      });
    });

    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/events", eventRouter);
    app.use("/api/organizations", organizationRouter);
    app.use("/api/event-register", eventRegistrationRouter);

    // 404 Handler
    app.use((_req, res, _next) => {
      res.status(404).json({
        error: {
          message: "Not Found",
        },
      });
    });
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
    await connectToDB();
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}

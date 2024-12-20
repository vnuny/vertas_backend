import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response
} from "express";
import AuthRouter from "./routes/admin/auth/auth";
import AdminRouter from "./routes/admin/admin";
import cookieParser from "cookie-parser";
let PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World!"
  });
});

app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);
app.use((req, res, next) => {
  const err = new Error("Not Found") as ErrorRequestHandler & {
    status: number;
    message: string;
  };
  err.status = 404;
  next(err);
});

app.use(
  (
    err: ErrorRequestHandler & {
      status: number;
      message: string;
      errors?: {
        field: string;
        message: string;
      }[];
    },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err);
    res.status(err.status).json(err);
  }
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 👽`);
});

import express from "express";
import routerUser from "./routes/routeUser.js";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./database/db.js";

const app = express();
const port = 8080;

app.use(cookieParser());

// 🔹 Middleware session harus dipasang sebelum router
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", routerUser);

app.get("/dashboard", (req, res) => {
  if (req.session.dataUser) {
    console.log("ini dari dashboard: " + req.session.dataUser);
    res.send({ login: true, user: req.session.dataUser });
  } else {
    res.send({ login: false });
  }
});

app.get("/", (req, res) => {
  res.send({ msg: "tes" });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

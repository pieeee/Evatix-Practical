const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");

// mysql connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "crud",
});

const connection = con.promise();

// app setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// create user
app.post("/api/signup", async (req, res) => {
  try {
    const signupBody = req.body;

    const [rows, fields] = await connection.execute(
      "SELECT * FROM `users` WHERE `email` = ?",
      [signupBody.email.toLowerCase()]
    );

    if (rows.length > 0) {
      res.status(200).json({ status: 0, message: "User Already Exist" });
    } else {
      await connection.query("INSERT INTO users SET ?", {
        ...signupBody,
        email: signupBody.email.toLowerCase(),
      });
      res
        .status(200)
        .json({ status: 1, message: "User Registered SuccessFully" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 0, message: error });
  }
});

// signin user
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows, fields] = await connection.query(
      "SELECT * FROM `users` WHERE `email` = ?",
      [email]
    );

    if (rows.length > 0 && rows[0].password == password) {
      const id = rows[0].id.toString();
      res.status(200).cookie("id", `${id}`, {
        sameSite: "strict",
        path: "/",
        expires: new Date(new Date().getTime() + 30 * 1000 * 60 * 60 * 24),
        httpOnly: true,
      });
      res
        .status(200)
        .cookie("signedIn", "true", {
          sameSite: "strict",
          path: "/",
          expires: new Date(new Date().getTime() + 30 * 1000 * 60 * 60 * 24),
        })
        .json({ status: 1, message: "signedIn" });
    } else if (rows.length > 0) {
      res.status(200).json({ status: 0, message: "Password is not correct" });
    } else {
      res.status(200).json({ status: 0, message: "Email is not registered" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

// update information
app.put("/api/profile", async (req, res) => {
  const id = req.cookies.id;

  try {
    const query = `UPDATE users SET ? WHERE ?`;
    await connection.query(query, [req.body, id]);
    const [rows, fields] = await connection.query(
      "SELECT * FROM `users` WHERE id = ?",
      [id]
    );

    res.json({ user: rows[0] });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// get user profile
app.get("/api/profile", async (req, res) => {
  const id = req.cookies.id;
  try {
    const [rows, fields] = await connection.query(
      "SELECT * FROM `users` WHERE id = ?",
      [id]
    );
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// delete account
app.delete("/api/profile", async (req, res) => {
  const id = req.cookies.id;
  try {
    const [rows, fields] = await connection.query(
      "DELETE FROM `users` WHERE id = ?",
      [id]
    );
    res.status(202).clearCookie("signedIn");
    res.status(202).clearCookie("id").json({ message: "signedout" });
    res.json({ status: 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

app.get("/api/logout", (req, res) => {
  res.status(202).clearCookie("signedIn");
  res.status(202).clearCookie("id").json({ message: "signedout" });
});

app.listen(8000, () => console.log("Server Running"));

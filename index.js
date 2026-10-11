import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();

app.listen(port, () => {
  console.log(`...Server running on ${port}...`);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/project", (req, res) => {
  res.render("project.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/sendEmail", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const emailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const mail = await emailer.sendMail({
      from: email,
      to: process.env.SMTP_USER,
      subject: `Message From ${name}`,
      text: message,
    });
    console.log(
      `Message Sent: ${mail.response} Message Size: ${mail.messageSize}`,
    );
    res.render("contact.ejs", { email: "Message Sent" });
  } catch (err) {
    console.log("...Error - Sending Email...", err);
  }
});

import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import csv from "csv-parser";
import cors from "cors";
import path from "path"; // Added for path handling
import { fileURLToPath } from "url"; // For ES6 module __dirname workaround

const authorizedUsers = ["satyam", "user2", "user3"];
const results = [];
const Dates = [];
const Times = [];

import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
const client = create();

const d = new Date();
console.log(d.toLocaleString());

fs.createReadStream("output.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data.CID + `'` + data.DATE + data.TIME))
  .on("end", () => {
    results.forEach((cid) => {
      console.log(cid);
    });
  });

app.use(bodyParser.urlencoded({ extended: true }));

const addNewLine = (s) => s + "\n";

const appendToCSV = (cid) => {
  let temp = `\n1,${cid},${d.toLocaleString()}`;
  fs.appendFileSync("output.csv", temp, addNewLine);
};

app.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { userID, text } = req.body;

    // Authorization check
    if (!authorizedUsers.includes(userID)) {
      return res.status(403).send("Unauthorized user.");
    }

    // Determine content (text or file)
    let content;
    if (text) {
      content = text;
    } else if (req.file) {
      content = fs.readFileSync(req.file.path);
    } else {
      return res.status(400).send("No content provided.");
    }

    // Upload content to IPFS
    const { cid } = await client.add({ content });
    console.log("Content CID:", cid.toString());

    // Save CID to CSV
    appendToCSV(cid.toString());

    // Clean up temporary file if uploaded
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.send(`Data received. CID: ${cid.toString()}`);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/cids", (req, res) => {
  res.json(results);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "server.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

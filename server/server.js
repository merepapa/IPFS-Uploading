import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
const results = [];
import fs from "fs";
import { create } from "ipfs-http-client";
import csv from "csv-parser";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
// IPFS client setup
const client = create();

const d = new Date();
// let time = d.getTime();
console.log(d.toLocaleString());

fs.createReadStream("output.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data.CID))
  .on("end", () => {
    results.forEach((cid) => {
      console.log(cid);
    });
  });

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// Function to add a new line to a string
const addNewLine = (s) => s + "\n";

// Function to append CID to a CSV file
const appendToCSV = (cid) => {
  let temp = `\n1,${cid},${d.toLocaleString()}`;
  fs.appendFileSync("output.csv", temp, addNewLine);
};

// Route to handle form submission
app.post("/submit", upload.single("file"), async (req, res) => {
  try {
    let content;

    // Check if text is present
    if (req.body.text) {
      content = req.body.text;
    }

    // Check if a file is uploaded
    if (req.file) {
      content = fs.readFileSync(req.file.path);
    }

    if (content) {
      // Upload content to IPFS
      console.log(content);
      const { cid } = await client.add({ content });
      console.log("Content CID:", cid.toString());

      // Save the CID to a local CSV file
      appendToCSV(cid.toString());
    }
    //changed data
    res.send("Data received and CID saved at = ");
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

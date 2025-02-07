const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.json());

const receiptsDB = {};

app.get("/", (req, res) => {
    console.log("Received GET request to /");
    res.send("Receipt Processing API is running! Use POST /receipts/process to submit receipts.");
});

function calculatePoints(receipt) {
    let points = 0;

    if (!receipt || !receipt.retailer || !receipt.total || !Array.isArray(receipt.items) || receipt.items.length === 0 || !receipt.purchaseDate || !receipt.purchaseTime) {
        return 0;
    }

    points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

    if (receipt.total.endsWith(".00")) {
        points += 50;
    }

    if (Math.abs(parseFloat(receipt.total) % 0.25) < Number.EPSILON) {
        points += 25;
    }

    points += Math.floor(receipt.items.length / 2) * 5;

    for (const item of receipt.items) {
        if (item.shortDescription.trim().length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    }

    if (parseInt(receipt.purchaseDate.split("-")[2], 10) % 2 === 1) {
        points += 6;
    }

    const [hour] = receipt.purchaseTime.split(":").map(Number);
    if (hour >= 14 && hour < 16) {
        points += 10;
    }

    if (parseFloat(receipt.total) - 10.00 > -Number.EPSILON) {
        points += 5;
    }

    return points;
}

app.post("/receipts/process", (req, res) => {
    console.log("Received a POST request to /receipts/process");

    if (!req.body) {
        console.log("ERROR: No request body received.");
        return res.status(400).json({ error: "Missing request body" });
    }

    console.log("Request Body:", req.body);

    const { retailer, total, items, purchaseDate, purchaseTime } = req.body;
    if (!retailer || !total || !Array.isArray(items) || items.length === 0 || !purchaseDate || !purchaseTime) {
        console.log("ERROR: Invalid receipt format. Missing required fields.");
        return res.status(400).json({ error: "Invalid receipt format. Missing required fields." });
    }

    const receiptId = uuidv4();
    const points = calculatePoints(req.body);

    receiptsDB[receiptId] = points;

    console.log(`Receipt Processed! ID: ${receiptId}, Points: ${points}`);
    res.status(200).json({ id: receiptId });
});

app.get("/receipts/:id/points", (req, res) => {
    console.log("Received a GET request to /receipts/:id/points");

    const receiptId = req.params.id;
    console.log(`Checking if receipt ID (${receiptId}) exists in database...`);

    if (receiptsDB.hasOwnProperty(receiptId)) {
        console.log(`Receipt found! Points: ${receiptsDB[receiptId]}`);
        return res.status(200).json({ points: receiptsDB[receiptId] });
    } else {
        console.log(`ERROR: Receipt ID (${receiptId}) not found.`);
        return res.status(404).json({ error: "No receipt found for that ID." });
    }
});

app.use((req, res, next) => {
    console.log(`404 ERROR: Route not found - ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

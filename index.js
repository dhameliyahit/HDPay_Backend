const express = require("express");
const { transtionTable } = require("./DB/initTable");
require("dotenv").config();
const cors = require("cors");
const pool = require("./DB/connectDB");

const app = express();


const initTable = async () => {
    try {
        await transtionTable();
        console.log("✅ All tables initialized successfully");
    } catch (error) {
        console.error("Error initializing tables:", error.message);
    }
}
initTable();

app.use(express.json());
app.use(cors());


app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

// app.get("/api/send-money", async (req, res) => {
//     try {
//         const { upiid, pn, am, tn, cu = "INR", call_back_url = "" } = req.query;

//         // Validate required fields
//         const requiredFields = { upiid, pn, am, tn, cu };
//         for (const [key, value] of Object.entries(requiredFields)) {
//             if (!value) {
//                 return res.status(400).json({ error: `${key} is required` });
//             }
//         }

//         // Generate transaction ID and reference number
//         const tid = `TID-${Date.now()}`;
//         const tr = `TR-${Date.now()}`;

//         // Insert into database
//         const insertQuery = `
//             INSERT INTO transation 
//             (upiid, pn, am, tid, tr, tn, cu, call_back_url) 
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//         `;
//         await pool.query(insertQuery, [upiid, pn, am, tid, tr, tn, cu, call_back_url]);

//         // Construct UPI URL
//         const upiURL = `upi://pay?pa=${upiid}&pn=${encodeURIComponent(pn)}&am=${am}&cu=${cu}&tn=${encodeURIComponent(tn)}&tid=${tid}&tr=${tr}`;
//         console.log("Generated UPI URL:", upiURL);

//         // Shorten the URL
//         const shortRes = await fetch("https://hdshort.vercel.app/api/v1/shortner", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ originalURL : upiURL }),
//         });

//         if (!shortRes.ok) {
//             const text = await shortRes.text();
//             console.error("Shortening service failed:", text);
//             return res.status(502).json({ error: "Failed to shorten UPI URL" });
//         }

//         const shortData = await shortRes.json();
//         console.log("Shortened URL:", shortData.backEndURL);
//         // Final response
//         res.status(200).json({
//             message: "Money request processed successfully",
//             data: {
//                 upiid,
//                 pn,
//                 am,
//                 tid,
//                 tr,
//                 tn,
//                 cu,
//                 call_back_url,
//                 upiURL: shortData.backEndURL,
//             },
//         });

//     } catch (error) {
//         console.error("Error in /api/send-money:", error.stack);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// app.get("/api/transactions", async (req, res) => {
//     try {
//         const {query} = req.query;
//         const result = await pool.query(query);
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error("Error fetching transactions:", error.stack);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


app.post("/api/transation", async (req, res) => {
    try {
        const { upiid, pn, am, tid, tr, tn, cu, call_back_url, PayURL } = req.body;

        if (!upiid?.trim() || !pn?.trim() || !am?.toString().trim() || !tid?.trim() || !tr?.trim() || !PayURL?.trim()) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const query = `
  INSERT INTO transation (upiid, pn, am, tid, tr, tn, cu, call_back_url, PayURL)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        const values = [upiid, pn, am, tid, tr, tn, cu, call_back_url, PayURL];


        await pool.query(query, values);
        console.log("Transaction inserted successfully");
        res.status(200).json({ message: "Transaction successful", PayURL });
    } catch (error) {
        console.error("Error during payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/", (req, res) => {
    res.send("Server working 🔥");
});



const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
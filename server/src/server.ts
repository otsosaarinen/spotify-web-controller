import "dotenv/config";
import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/auth", (req, res) => {
    console.log(req.body);
    res.send(`POST request received at port ${port}`);
});

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});

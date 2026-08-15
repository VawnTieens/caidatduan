const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Chào mừng đến với ứng dụng Danh Sách Liên Hệ." });
});

module.exports = app;
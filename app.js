const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/contact.route");
const usersRouter = require("./app/routes/user.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>  {
    res.json({message: "Chào mừng đến với ứng dụng Danh Sách Liên Hệ."});
});

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next)   =>   {
    return next(new ApiError(404, "Resource not found"));
});

app.use((error, req, res, next)   =>  {
    return res.status(error.statusCode  ||  500).json({
        message: error.message  ||  "Internal Server Error",
    });
});

module.exports = app;
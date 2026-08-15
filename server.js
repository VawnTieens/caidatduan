const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Kết nối thành công đến MongoDB.");

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}.`);
        });
    } catch (error) {
        console.error("Lỗi khi khởi động server:", error);
        process.exit();
    }
}

startServer();
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.register = async (req, res, next) => {
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Username và password không được để trống"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        // Tạo collection 'users' dùng chung trong ContactService
        const userCol = MongoDB.client.db().collection("users");
        
        const existUser = await userCol.findOne({ username: req.body.username });
        if (existUser) {
            return next(new ApiError(400, "Tài khoản này đã tồn tại"));
        }

        const newUser = {
            username: req.body.username,
            password: req.body.password, // Đồ án cơ bản lưu text thuần, nâng cao có thể dùng bcrypt
        };
        
        const result = await userCol.insertOne(newUser);
        return res.send({ message: "Đăng ký tài khoản thành công", userId: result.insertedId });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi đăng ký tài khoản"));
    }
};

exports.login = async (req, res, next) => {
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Username và password không được để trống"));
    }

    try {
        const userCol = MongoDB.client.db().collection("users");
        const user = await userCol.findOne({ 
            username: req.body.username, 
            password: req.body.password 
        });

        if (!user) {
            return next(new ApiError(401, "Tài khoản hoặc mật khẩu không chính xác"));
        }

        return res.send({ 
            message: "Đăng nhập thành công", 
            userId: user._id, 
            username: user.username 
        });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi đăng nhập"));
    }
};
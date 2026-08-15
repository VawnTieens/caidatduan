const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return next(new ApiError(401, "Bạn chưa đăng nhập"));
    if (!req.body?.name) return next(new ApiError(400, "Tên không được để trống"));

    try {
        const contactService = new ContactService(MongoDB.client);
        req.body.ownerId = userId;
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi tạo liên hệ"));
    }
};

exports.findAll = async (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return next(new ApiError(401, "Bạn chưa đăng nhập"));

    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name, hobby } = req.query;
        
        if (name) {
            documents = await contactService.findByName(name, userId);
        } else if (hobby) {
            documents = await contactService.findByHobby(hobby, userId);
        } else {
            documents = await contactService.find({ ownerId: userId });
        }
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi lấy danh bạ"));
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if (!document) return next(new ApiError(404, "Không tìm thấy liên hệ"));
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi lấy liên hệ với id=${req.params.id}`));
    }
};

exports.update = async (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return next(new ApiError(401, "Bạn chưa đăng nhập"));
    if (Object.keys(req.body).length === 0) return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));

    try {
        const contactService = new ContactService(MongoDB.client);
        req.body.ownerId = userId;
        const document = await contactService.update(req.params.id, req.body);
        if (!document) return next(new ApiError(404, "Không tìm thấy liên hệ để cập nhật"));
        return res.send({ message: "Liên hệ được cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, `Lỗi khi cập nhật liên hệ với id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) return next(new ApiError(404, "Không tìm thấy liên hệ để xóa"));
        return res.send({ message: "Liên hệ đã được xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, `Không thể xóa liên hệ với id=${req.params.id}`));
    }
};

exports.deleteAll = async (req, res, next) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return next(new ApiError(401, "Bạn chưa đăng nhập"));

    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll(userId);
        return res.send({ message: `Đã xóa thành công ${deletedCount} liên hệ` });
    } catch (error) {
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả danh bạ"));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    return res.send([]);
};
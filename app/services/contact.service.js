const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name, userId) {
        return await this.find({
            ownerId: userId,
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    extractContactData(payload) {
        return {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            hobbies: Array.isArray(payload.hobbies) ? payload.hobbies : [], // Đã ĐỔI: favorite -> hobbies
            ownerId: payload.ownerId,
        };
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            { name: contact.name, ownerId: contact.ownerId }, 
            { $set: contact },
            { returnDocument: "after", upsert: true }
        );
        return result.value ? result.value : result;
    }

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value ? result.value : result;
    }

    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async findByHobby(hobby, userId) {
        return await this.find({ hobbies: hobby, ownerId: userId });
    }

    async deleteAll(userId) {
        const result = await this.deleteMany({ ownerId: userId });
        return result.deletedCount;
    }   
}

module.exports = ContactService;
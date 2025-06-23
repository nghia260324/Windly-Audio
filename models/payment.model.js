const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const paymentSchema = new Schema({
    _id: { type: String, default: uuidv4, required: true },

    userId: { type: String, ref: "user", required: true }, // người mua
    amount: { type: Number, required: true }, // số tiền chuyển
    currency: { type: String, default: 'VND' },

    package: {
        type: String,
        enum: ['premium'],
        default: 'premium'
    },

    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },

    transactionId: { type: String, default: null }, // ID từ Casso nếu có
    bankCode: { type: String, default: null },      // mã ngân hàng
    senderName: { type: String, default: null },    // người chuyển
    message: { type: String, default: null },       // nội dung chuyển khoản

    paidAt: { type: Date },                         // thời điểm thanh toán thành công
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("payment", paymentSchema, "payments");

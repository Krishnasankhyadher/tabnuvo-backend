import mongoose from "mongoose";

const userEnquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });   
const UserEnquiry = mongoose.model("UserEnquiry", userEnquirySchema);

export default UserEnquiry;
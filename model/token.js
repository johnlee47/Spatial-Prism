import mongoose from "mongoose";
import user from "./user.js";
const tokenSchema = mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId, 
        ref: user,
    },
 
    token: {
        type: String,
        required: true,
    },

});

export default mongoose.model("Token", tokenSchema);





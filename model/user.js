import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  role:{type:String,
     default:'client'},
  password: { type: String, required: true },
  controlled: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  id: { type: String },
});



export default mongoose.model("User", userSchema);





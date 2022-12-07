import mongoose from "mongoose";
import bcrypt from "bcrypt"

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "the name field is mandatory"],
  },
  email: {
    type: String,
    required: [true, "the email field is mandatory"],
  },
  password: {
    type: String,
    required: [true, "the password field is mandatory"],
  },
  
},{
    timestamps:true
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export const userModel = model("user", userSchema);

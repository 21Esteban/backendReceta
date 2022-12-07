import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the name field is mandatory"],
    },
    description: {
      type: String,
      required: [true, "the description field is mandatory"],
    },
    imgUrl: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  { timestamps: true }
);
categorySchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const categoryModel = model("category", categorySchema);

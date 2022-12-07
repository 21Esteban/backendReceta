import mongoose from "mongoose";

const { Schema, model } = mongoose;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "the name field is mandatory"],
    },
    description: {
      type: String,
      required: [true, "the description field is mandatory"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [true, "the rating field is mandatory"],
    },

    imgUrl: {
      type: String,
      default: null,
    },
    public_id: {
      type: String,
    },
    
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

recipeSchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const recipeModel = model("product", recipeSchema);

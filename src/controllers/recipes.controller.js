import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/response.js";
import { categoryModel } from "../models/Category.js";
import {  recipeModel } from "../models/Recipes.js";

const recipeCtrl = {};

recipeCtrl.listRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel
      .find()
      .populate("category", { name: 1, description: 1 });

    response(res, 200, true, recipes, "list of recipes");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

recipeCtrl.listById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeModel
      .findById(id)
      .populate("category", { name: 1, description: 1 });

    if (!recipe) {
      return response(res, 404, false, "", "record not found");
    }

    response(res, 200, true, recipe, "recipe found");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

recipeCtrl.createRecipe = async (req, res) => {
  try {
    const newRecipe = new recipeModel(req.body);

    if (req.file) {
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      newRecipe.setImg({ secure_url, public_id });
    }

    await recipeModel.create(newRecipe);

    response(res, 201, true, newRecipe, "created recipe");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

recipeCtrl.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await recipeModel.findById(id);

    if (!recipe) {
      return response(res, 404, false, "", "record not found");
    }

    if (recipe.public_id) {
      await eliminarImagenCloudinary(recipe.public_id);
    }

    await recipe.deleteOne();

    response(res, 200, true, "", "eliminated recipe");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

recipeCtrl.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const { category } = req.body;

    const recipe = await recipeModel.findById(id);

    if (!recipe) {
      return response(res, 404, false, "", "record not found");
    }
    if (req.file) {
      if (recipe.public_id) {
        await eliminarImagenCloudinary(recipe.public_id);
      }
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      recipe.setImg({ secure_url, public_id });
      await recipe.save();
    }

    if (category !== recipe.category.toString()) {
      const categoryFound = await categoryModel.findOne({
        _id: category,
      });

      if (!categoryFound) {
        return response(res, 404, false, "", "category not found");
      }

      await recipe.updateOne(req.body);
    }

    await recipe.updateOne(req.body);

    response(res, 200, true, "", "upgraded recipe");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default recipeCtrl;

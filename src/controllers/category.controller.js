import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/response.js";
import { categoryModel } from "../models/Category.js";
import { recipeModel } from "../models/Recipes.js";

// se crea una variable asignandole un arreglo vacio para simplificar el codigo
const categoryCtrl = {};

//aca listamos todas las categorias que han sido creadas para mostrarlas al usuario
categoryCtrl.listCategories = async (req, res) => {
  try {
    //aca lo que hacemos es llamar al modelo de categorias y decirle que nos encuentre las categorias que tenga
    const categories = await categoryModel.find();

    response(res, 200, true, categories, "list of categories");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

//aca listamos a una sola categoria llamandola por el id
categoryCtrl.listById = async (req, res) => {
  try {
    const { id } = req.params;

    //aca le decimos al modelo que encuentre la categoria por el id
    const category = await categoryModel.findById(id);

    //si no encontro la categoria nos devuelve que no la encontro
    if (!category) {
      return response(res, 404, false, "", "record not found");
    }
    //aca lo que hacemos es llamar al modelo de los productos para saber cuantos productos tienes asociados una categoria y de haria con el {products.length}
    const recipes = await recipeModel.find({ category });
    response(
      res,
      200,
      true,
      { ...category._doc, recipes: recipes.length },
      "category found"
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.createCategory = async (req, res) => {
  try {
    //aca lo que hacemos es crear un nuevo modelo con lo que le llegue por el req.body
    const newCategory = new categoryModel(req.body);

    if (req.file) {
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      newCategory.setImg({ secure_url, public_id });
    }

    //y aca le decimos al modelo que cree el que asignamos arriba
    await categoryModel.create(newCategory);
    response(res, 201, true, newCategory, "created category");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);
    if (!category) {
      return response(res, 404, false, "", "record not found");
    }

    const recipeFound = await recipeModel.findOne({
      category: category._id,
    });
    if (recipeFound) {
      return response(
        res,
        400,
        false,
        "",
        "this category cannot be deleted because it has linked products"
      );
    }
    if (category.public_id) {
      await eliminarImagenCloudinary(category.public_id);
    }

    await category.deleteOne();

    response(res, 200, true, "", "Category deleted correctly");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
      return response(res, 404, false, "", "record not found");
    }

    await category.updateOne(req.body);

    response(res, 200, true, "", "Category Correctly Updated");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default categoryCtrl;

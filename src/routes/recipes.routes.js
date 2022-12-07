import { Router } from "express";
import recipeCtrl from "../controllers/recipes.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/UploadImg.js";

const route = Router();

route.get("/", recipeCtrl.listRecipes);
route.get("/:id", recipeCtrl.listById);
route.post("/",  upload.single("img"), recipeCtrl.createRecipe);
route.delete("/:id",  recipeCtrl.deleteRecipe);
route.put("/:id", upload.single("img"), recipeCtrl.updateRecipe);

export default route;

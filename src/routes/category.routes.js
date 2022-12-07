import { Router } from "express";
import categoryCtrl from "../controllers/category.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/UploadImg.js";

const route = Router();

route.get("/", categoryCtrl.listCategories);
route.get("/:id", categoryCtrl.listById);
route.post("/", upload.single("img"), categoryCtrl.createCategory);
route.delete("/:id", categoryCtrl.deleteCategory);
route.put("/:id", upload.single("img"), categoryCtrl.updateCategory);

export default route;

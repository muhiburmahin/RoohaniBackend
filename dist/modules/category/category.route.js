import express from "express";
import { categoryController } from "./category.controller.js";
//import auth from "../../middleware/atth.js";
//import { Role } from "../../generated/prisma/index.js";
const route = express.Router();
route.get("/", categoryController.getAllCategories);
route.post("/", categoryController.createCategory);
route.delete("/:id", categoryController.deleteCategoryById);
export const categoryRoute = route;
//auth(Role.ADMIN)

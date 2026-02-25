import express from "express";
import { productController } from "./product.controller.js";
import { auth } from "../../middleware/auth.js";
import { Role } from "../../constants/user.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ProductValidation } from "./product.validation.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
    "/",
    auth(Role.admin),
    validateRequest(ProductValidation.createProductSchema),
    productController.createProduct
);
router.patch("/:id", auth(Role.admin), productController.updateProductById);
router.delete("/:id", auth(Role.admin), productController.deleteProductById);

export const productRoute = router;




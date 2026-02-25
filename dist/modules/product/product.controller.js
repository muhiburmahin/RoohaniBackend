import { AppError } from "../../middleware/appError.js";
import { productService } from "./product.service.js";
const createProduct = async (req, res, next) => {
    try {
        const adminId = req.user?.id;
        if (!adminId) {
            throw new AppError("You must be logged in as admin to add products", 401);
        }
        const result = await productService.createProduct(req.body, adminId);
        res.status(201).json({
            success: true,
            message: "Product added to Roohani collection!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json({
            success: true,
            message: "All products retrieved successfully",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const getProductById = async (req, res, next) => {
    try {
        const result = await productService.getProductById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product details retrieved",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const updateProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.updateProductById(id, req.body);
        res.status(200).json({
            success: true,
            message: "Roohani product updated successfully!",
            data: result
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deleteProductById(id);
        res.status(200).json({
            success: true,
            message: "Product removed from Roohani collection!",
            data: null
        });
    }
    catch (error) {
        next(error);
    }
};
export const productController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById
};

import { categoryService } from "./category.service.js";
//create Cetagory
const createCategory = async (req, res) => {
    try {
        const { name: category } = req.body;
        if (!category) {
            throw new Error("Category name is required");
        }
        const result = await categoryService.createCategory(category);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Category created failed",
            error: err.message
        });
    }
};
//get all Category
const getAllCategories = async (req, res) => {
    try {
        const result = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result.categories,
            total: result.totalCount,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch categories",
            error: err.message
        });
    }
};
//Category delete by id
const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoryService.deleteCategoryById(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: result
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to delete category",
            error: err.message
        });
    }
};
export const categoryController = {
    createCategory,
    getAllCategories,
    deleteCategoryById
};

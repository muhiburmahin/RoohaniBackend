import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/appError.js";
import { paginationHelper } from "../../utils/paginationHelper.js";
const createProduct = async (payload, adminId) => {
    const admin = await prisma.user.findUnique({
        where: { id: adminId },
    });
    if (!admin)
        throw new AppError("Admin account not found", 404);
    const category = await prisma.category.findUnique({
        where: { id: payload.categoryId },
    });
    if (!category)
        throw new AppError("Invalid Category ID", 400);
    const product = await prisma.product.create({
        data: {
            name: payload.name,
            description: payload.description,
            variantType: payload.variantType,
            sizes: payload.sizes || [],
            variantPrices: payload.variantPrices || {},
            basePrice: parseFloat(payload.basePrice),
            stock: parseInt(payload.stock),
            images: payload.images || [],
            categoryId: payload.categoryId,
        },
    });
    return product;
};
const getAllProducts = async (query) => {
    // searchTerm এবং category ফ্রন্টএন্ড থেকে এই নামেই আসবে
    const { searchTerm, category, sort, minPrice, maxPrice, ...options } = query;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    // সর্টিং লজিক ফিক্স
    let finalSortBy = sortBy === 'price' ? 'basePrice' : sortBy;
    let finalSortOrder = sortOrder;
    if (sort === 'price-low') {
        finalSortBy = 'basePrice';
        finalSortOrder = 'asc';
    }
    else if (sort === 'price-high') {
        finalSortBy = 'basePrice';
        finalSortOrder = 'desc';
    }
    const whereConditions = {
        AND: [
            searchTerm ? {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } }
                ]
            } : {},
            category ? { categoryId: category } : {},
            minPrice ? { basePrice: { gte: parseFloat(minPrice) } } : {},
            maxPrice ? { basePrice: { lte: parseFloat(maxPrice) } } : {},
        ]
    };
    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { category: { select: { name: true } } },
            orderBy: { [finalSortBy]: finalSortOrder }
        }),
        prisma.product.count({ where: whereConditions })
    ]);
    return {
        meta: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        },
        data: products
    };
};
const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: {
            id
        },
        include: { category: true }
    });
    if (!product)
        throw new AppError("Product not found in Roohani inventory", 404);
    return product;
};
const updateProductById = async (id, payload) => {
    const isProductExist = await prisma.product.findUnique({
        where: { id }
    });
    if (!isProductExist) {
        throw new AppError("Product not found to update!", 404);
    }
    const updateData = { ...payload };
    if (payload.basePrice !== undefined) {
        updateData.basePrice = parseFloat(payload.basePrice);
        delete updateData.price;
    }
    if (payload.stock !== undefined) {
        updateData.stock = parseInt(payload.stock);
    }
    const result = await prisma.product.update({
        where: { id },
        data: updateData,
    });
    return result;
};
// product.service.ts
// product.service.ts
export const deleteProductById = async (id) => {
    // সরাসরি ডিলিট করার চেষ্টা করবে
    try {
        const result = await prisma.product.delete({
            where: { id }
        });
        return result;
    }
    catch (error) {
        if (error.code === 'P2003') {
            throw new Error("Cannot delete! This product is linked to an order. Please update your prisma schema with 'onDelete: SetNull'.");
        }
        throw error;
    }
};
export const productService = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById
};

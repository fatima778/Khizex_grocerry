import { Request, Response } from "express";
import { Product } from "../models/Product";

export async function getProducts(req: Request, res: Response): Promise<void> {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    inStock,
    sort,
    page = "1",
    limit = "12",
  } = req.query;

  const filter: Record<string, unknown> = {};

  if (category) filter.category = category;
  if (search) filter.$text = { $search: String(search) };
  if (inStock === "true") filter.stock = { $gt: 0 };
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    products,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
  });
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.status(200).json(product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.status(200).json(product);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.status(200).json({ message: "Product deleted" });
}

export async function bulkUpdateStock(req: Request, res: Response): Promise<void> {
  const { updates } = req.body as { updates: { productId: string; stockToAdd: number }[] };

  const results = await Promise.all(
    updates.map((u) =>
      Product.findByIdAndUpdate(u.productId, { $inc: { stock: u.stockToAdd } }, { new: true })
    )
  );

  res.status(200).json({ updated: results });
}

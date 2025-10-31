import { ShippingFeeMethod } from "@prisma/client";
import * as z from "zod";

// Category form schema
export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long.")
    .max(50, "Category name cannot exceed 50 characters.")
    .regex(/^[a-zA-Z0-9\s'&-]+$/, "Only letters, numbers, and spaces are allowed in the category name."),
  image: z.object({ url: z.string() }).array().length(1, "Choose a category image."),
  url: z
    .string()
    .min(2, "Category url must be at least 2 characters long.")
    .max(50, "Category url cannot exceed 50 characters.")
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."),
  featured: z.boolean().default(false),
});

// SubCategory schema
export const SubCategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "SubCategory name must be at least 2 characters long.")
    .max(50, "SubCategory name cannot exceed 50 characters.")
    .regex(/^[a-zA-Z0-9\s'&-]+$/, "Only letters, numbers, and spaces are allowed in the subCategory name."),
  image: z.object({ url: z.string() }).array().length(1, "Choose only one subCategory image"),
  url: z
    .string()
    .min(2, "SubCategory url must be at least 2 characters long.")
    .max(50, "SubCategory url cannot exceed 50 characters.")
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphen, and underscore are allowed in the subCategory url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."),
  categoryId: z.string().uuid(),
  featured: z.boolean().default(false),
});

// Store schema
export const StoreFormSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be at least 2 characters long.")
    .max(50, "Store name cannot exceed 50 characters.")
    .regex(/^(?!.*(?:[-_& ]){2,})[a-zA-Z0-9_ &-]+$/, "Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."),
  description: z
    .string()
    .min(30, "Store description must be at least 30 characters long.")
    .max(500, "Store description cannot exceed 500 characters."),
  email: z.string().email("Invalid email format."),
  phone: z.string().regex(/^\+?\d+$/, "Invalid phone number format."),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z.object({ url: z.string() }).array().length(1, "Choose a cover image."),
  url: z
    .string()
    .min(2, "Store url must be at least 2 characters long.")
    .max(50, "Store url cannot exceed 50 characters.")
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});

// Product schema
export const ProductFormSchema = z.object({
  name: z.string().min(2, "Product name should be at least 2 characters long.").max(200, "Product name cannot exceed 200 characters."),
  description: z.string().min(200, "Product description should be at least 200 characters long."),
  variantName: z.string().min(2, "Product variant name should be at least 2 characters long.").max(100, "Product variant name cannot exceed 100 characters."),
  variantDescription: z.string().optional(),
  images: z.object({ url: z.string() }).array().min(3, "Please upload at least 3 images for the product.").max(6, "You can upload up to 6 images for the product."),
  variantImage: z.object({ url: z.string() }).array().length(1, "Choose a product variant image."),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid(),
  offerTagId: z.string().uuid().optional(),
  brand: z.string().min(2, "Product brand should be at least 2 characters long.").max(50, "Product brand cannot exceed 50 characters."),
  sku: z.string().min(6, "Product SKU should be at least 6 characters long.").max(50, "Product SKU cannot exceed 50 characters."),
  weight: z.number().min(0.01, "Please provide a valid product weight."),
  keywords: z.string().array().min(5, "Please provide at least 5 keywords.").max(10, "You can provide up to 10 keywords."),
  colors: z.object({ color: z.string() }).array().min(1, "Please provide at least one color.").refine((colors) => colors.every((c) => c.color.length > 0), { message: "All color inputs must be filled." }),
  sizes: z.object({
    size: z.string(),
    quantity: z.number().min(1, "Quantity must be greater than 0."),
    price: z.number().min(0.01, "Price must be greater than 0."),
    discount: z.number().min(0).default(0),
  }).array().min(1, "Please provide at least one size.").refine((sizes) => sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0), { message: "All size inputs must be filled correctly." }),
  product_specs: z.object({ name: z.string(), value: z.string() }).array().min(1, "Please provide at least one product spec.").refine((specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0), { message: "All product specs inputs must be filled correctly." }),
  variant_specs: z.object({ name: z.string(), value: z.string() }).array().min(1, "Please provide at least one product variant spec.").refine((specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0), { message: "All product variant specs inputs must be filled correctly." }),
  questions: z.object({ question: z.string(), answer: z.string() }).array().min(1, "Please provide at least one product question.").refine((qs) => qs.every((q) => q.question.length > 0 && q.answer.length > 0), { message: "All product question inputs must be filled correctly." }),
  isSale: z.boolean().default(false),
  saleEndDate: z.string().optional(),
  freeShippingForAllCountries: z.boolean().default(false),
  freeShippingCountriesIds: z.object({ id: z.string().optional(), label: z.string(), value: z.string() }).array().optional().refine((ids) => ids?.every((item) => item.label && item.value), "Each country must have a valid name and ID.").default([]),
  shippingFeeMethod: z.nativeEnum(ShippingFeeMethod),
});

// Shipping address schema
export const ShippingAddressSchema = z.object({
  countryId: z.string({ error: "Country must be a valid string." }).uuid(),
  firstName: z.string({ error: "First name must be a valid string." }).min(2, "First name should be at least 2 characters long.").max(50, "First name cannot exceed 50 characters.").regex(/^[a-zA-Z]+$/, "No special characters are allowed in name."),
  lastName: z.string({ error: "Last name must be a valid string." }).min(2, "Last name should be at least 2 characters long.").max(50, "Last name cannot exceed 50 characters.").regex(/^[a-zA-Z]+$/, "No special characters are allowed in name."),
  phone: z.string({ error: "Phone number must be a string." }).regex(/^\+?\d+$/, "Invalid phone number format."),
  address1: z.string({ error: "Address line 1 must be a valid string." }).min(5, "Address line 1 should be at least 5 characters long.").max(100, "Address line 1 cannot exceed 100 characters."),
  address2: z.string({ error: "Address line 2 must be a valid string." }).max(100, "Address line 2 cannot exceed 100 characters.").optional(),
  state: z.string({ error: "State must be a valid string." }).min(2, "State should be at least 2 characters long.").max(50, "State cannot exceed 50 characters."),
  city: z.string({ error: "City must be a valid string." }).min(2, "City should be at least 2 characters long.").max(50, "City cannot exceed 50 characters."),
  zip_code: z.string({ error: "Zip code must be a valid string." }).min(2, "Zip code should be at least 2 characters long.").max(10, "Zip code cannot exceed 10 characters."),
  default: z.boolean().default(false),
});

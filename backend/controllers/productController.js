import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

//@desc Fetch all products
//@route GET/api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;


    const keyword = req.query.keyword ?
        { name: { $regex: req.query.keyword, $options: "i" } }
        : {};

    const count = await Product.countDocuments({ ...keyword });

    // const products = await Product.find({});
    // res.json(products);
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch a product
//@route GET/api/product/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


//@desc Create a product
//@route POST/api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});


//@desc Update product
//@route PUT/api/products/:id
//@access Public
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});



//@desc delete product
//@route DELETE/api/products/:id
//@access private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id })
        res.status(200).json({ message: "Product deleted successfully" });
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});


//@desc new review
//@route POST/api/products/:id/reviews
//@access private
const createProductReview = asyncHandler(async (req, res) => {
    // Extracting data from the request body
    const { rating, comment } = req.body;

    // Finding a product by its ID in the database
    const product = await Product.findById(req.params.id);

    if (product) {
        // Checking if the user has already reviewed the product
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            // If the user has already reviewed the product, return an error
            res.status(400);
            throw new Error("Product already reviewed");
        }

        // Creating a new review object
        const review = {
            name: req.user.name,      // User's name
            rating: Number(rating),   // Rating provided by the user
            comment,                  // User's comment or review
            user: req.user._id,       // User's ID
        };

        // Adding the new review to the product's reviews array
        product.reviews.push(review);

        // Updating the number of reviews for the product
        product.numReviews = product.reviews.length;

        // Calculating the average rating for the product
        product.rating =
            product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length;

        // Saving the updated product in the database
        await product.save();

        // Sending a success response
        res.status(201).json({ message: "Review added" });
    } else {
        // If the product is not found, return a "not found" error
        res.status(404);
        throw new Error('Resource not found');
    }
});


//@desc Get top rated products
//@route GET/api/product/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).json(products);
});



export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
};
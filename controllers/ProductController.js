const ResponseManager = require("../middleware/ResponseManager");
const {
  Product,
  productType,
  productCategory,
  Transaction,
} = require("../model/productModel"); // call model
const { cloudinary } = require("../utils/cloudinary");

class ProductController {
  static async getProduct(req, res) {
    // get all data product
    try {
      Product.belongsTo(productCategory, { foreignKey: "categoryID" });
      productCategory.hasMany(Product, { foreignKey: "categoryID" });

      var products = await Product.findAll({ include: [productCategory] });

      await ResponseManager.SuccessResponse(req, res, 200, products);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getProductType(req, res) {
    //get all product type
    try {
      const productTypes = await productType.findAll();
      await ResponseManager.SuccessResponse(req, res, 200, productTypes);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }
  static async getProductByProductType(req, res) {
    //get product by type
    try {
      const ProductByProductType = await Product.findAll({
        where: {
          productTypeID: req.params.id,
        },
      });
      await ResponseManager.SuccessResponse(
        req,
        res,
        200,
        ProductByProductType
      );
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddProduct(req, res) {
    //add product
    try {
        console.log(req.body.productname)

      const addproduct = await Product.findOne({
        where: {
          productname: req.body.productname,
        },
      });
      if (addproduct) {
        await ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "Product already exists"
        );
      } else {
        // Upload image to Cloudinary
        if (req.file && req.file.size > 5 * 1024 * 1024) {
          res.status(400).json({ error: "File size exceeds 5 MB limit" });
        } else {
          const result = await cloudinary.uploader.upload(req.file.path);

          const insert_product = await Product.create({
            // productID: req.body.productID,
            productTypeID: req.body.productTypeID,
            productname: req.body.productname,
            productdetail: req.body.productdetail,
            amount: req.body.amount,
            price: req.body.price,
            productcost: req.body.productcost,
            categoryID: req.body.categoryID,
            productImg: result.secure_url, // Save Cloudinary image path
          });

          await ResponseManager.SuccessResponse(req, res, 200, insert_product);
        }
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

//   static async EditProduct(req, res) {
//     //add product
//     try {
//       const editproduct = await Product.findOne({
//         where: {
//           productID: req.params.id,
//         },
//       });
//       if (editproduct) {
//         if (req.file && req.file.size > 5 * 1024 * 1024) {
//           res.status(400).json({ error: "File size exceeds 5 MB limit" });
//         } else {
            
//           const result = await cloudinary.uploader.upload(req.file.path);

//           await Product.update(
//             {
//               productTypeID: req.body.productTypeID,
//               productname: req.body.productname,
//               productdetail: req.body.productdetail,
//               amount: req.body.amount,
//               price: req.body.price,
//               productcost: req.body.productcost,
//               categoryName: req.body.categoryName,
//               productImg: result.secure_url, // Save Cloudinary image path
//             },
//             {
//               where: {
//                 productID: req.params.id,
//               },
//             }
//           );
//         }
//         await ResponseManager.SuccessResponse(req, res, 200, "Product Updated");
//       } else {
//         await ResponseManager.ErrorResponse(req, res, 400, "No product found");
//       }
//     } catch (err) {
//       await ResponseManager.CatchResponse(req, res, err.message);
//     }
//   }

static async EditProduct(req, res) {
    //add product
    try {
        const editproduct = await Product.findOne({
            where: {
                productID: req.params.id,
            },
        });

        if (editproduct) {
            if (req.file && req.file.size > 5 * 1024 * 1024) {
                res.status(400).json({ error: "File size exceeds 5 MB limit" });
            } else {
                let productUpdateData = {
                    productTypeID: req.body.productTypeID,
                    productname: req.body.productname,
                    productdetail: req.body.productdetail,
                    amount: req.body.amount,
                    price: req.body.price,
                    productcost: req.body.productcost,
                    categoryName: req.body.categoryName,
                };

                if (req.file) {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    productUpdateData.productImg = result.secure_url; // Save Cloudinary image path
                }

                await Product.update(
                    productUpdateData,
                    {
                        where: {
                            productID: req.params.id,
                        },
                    }
                );
            }

            await ResponseManager.SuccessResponse(req, res, 200, "Product Updated");
        } else {
            await ResponseManager.ErrorResponse(req, res, 400, "No product found");
        }
    } catch (err) {
        await ResponseManager.CatchResponse(req, res, err.message);
    }
}

  static async DeleteProduct(req, res) {
    //delete product
    try {
      const deleteproduct = await Product.findOne({
        where: {
          productID: req.params.id,
        },
      });
      if (deleteproduct) {
        await Product.destroy({
          where: {
            productID: req.params.id,
          },
        });
        await ResponseManager.SuccessResponse(req, res, 200, "Product Deleted");
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No product found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddCategory(req, res) {
    //add category
    try {
      const addcate = await productCategory.findOne({
        where: {
          categoryName: req.body.categoryName,
        },
      });
      if (addcate) {
        res.json({
          status: false,
          message: "Category already exis",
        });
      } else {
        const insert_cate = await productCategory.create({
          categoryName: req.body.categoryName,
        });
        console.log(req.body);
        await ResponseManager.SuccessResponse(req, res, 200, insert_cate);
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async EditCategory(req, res) {
    //add product
    try {
      const delcate = await productCategory.findOne({
        where: {
          categoryID: req.params.id,
        },
      });
      if (delcate) {
        await productCategory.update(
          {
            categoryName: req.body.categoryName,
          },
          {
            where: {
              categoryID: req.params.id,
            },
          }
        );
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Category Updated"
        );
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No Category found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteCategory(req, res) {
    //delete product
    try {
      const deletecate = await productCategory.findOne({
        where: {
          categoryID: req.params.id,
        },
      });
      if (deletecate) {
        await productCategory.destroy({
          where: {
            categoryID: req.params.id,
          },
        });
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "Category Deleted"
        );
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "No Category found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddTransaction(req, res) {
    //add category
    // console.log("working")
    // res.send("test222");
    try {
      const timestamp = Date.now();
      const dateObject = new Date(timestamp);

      // กำหนด locale เป็น 'th' และใช้ toLocaleDateString() และ toLocaleTimeString() ในการแสดงวันที่และเวลา
      const thaiDateString = dateObject.toLocaleDateString('th') + ' ' + dateObject.toLocaleTimeString('th');


      const getProductByid = await Product.findOne({
        where: {
          productID: req.body.productID,
        },
      });

      if (getProductByid) {
        const transactionType = req.body.transactionType;

        if (transactionType == "receive") {
          await Transaction.create({
            productID: req.body.productID,
            transactionType: transactionType,
            transactionDetail: req.body.transactionDetail,
            quantity_added: req.body.quantity,
            quantity_removed: 0,
            transaction_date: thaiDateString,
          });

          await Product.update(
            {
              amount: req.body.quantity + getProductByid.dataValues.amount,
            },
            {
              where: {
                productID: req.body.productID,
              },
            }
          );

          await ResponseManager.SuccessResponse(
            req,
            res,
            200,
            "product receive success"
          );
        } else if (transactionType == "issue") {
          if (getProductByid.dataValues.amount < req.body.quantity) {
            await ResponseManager.ErrorResponse(
              req,
              res,
              400,
              "product amount low then quantity"
            );
          } else {
            await Transaction.create({
              productID: req.body.productID,
              transactionType: transactionType,
              transactionDetail: req.body.transactionDetail,
              quantity_removed: req.body.quantity,
              quantity_added: 0,
              transaction_date: thaiDateString,
            });

            await Product.update(
              {
                amount: getProductByid.dataValues.amount - req.body.quantity,
              },
              {
                where: {
                  productID: req.body.productID,
                },
              }
            );

            await ResponseManager.SuccessResponse(
              req,
              res,
              200,
              "product issue success"
            );
          }
        } else {
          await ResponseManager.ErrorResponse(
            req,
            res,
            400,
            "transactionType not correct"
          );
        }
      } else {
        await ResponseManager.ErrorResponse(req, res, 400, "Product Not found");
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async AddProductType(req, res) {
    //add category
    try {
      const addcate = await productType.findOne({
        where: {
          productTypeName: req.body.productTypeName,
        },
      });
      if (addcate) {
        res.json({
          status: false,
          message: "ProductType already exists",
        });
      } else {
        const insert_cate = await productType.create({
          productTypeName: req.body.productTypeName,
        });
        console.log(req.body);
        await ResponseManager.SuccessResponse(req, res, 200, insert_cate);
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async DeleteProductType(req, res) {
    //delete product
    try {
      const deletecate = await productType.findOne({
        where: {
          productTypeID: req.params.id,
        },
      });
      if (deletecate) {
        await productType.destroy({
          where: {
            productTypeID: req.params.id,
          },
        });
        await ResponseManager.SuccessResponse(
          req,
          res,
          200,
          "ProductType Deleted"
        );
      } else {
        await ResponseManager.ErrorResponse(
          req,
          res,
          400,
          "No ProductType found"
        );
      }
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }

  static async getCategory(req, res) {
    //get all product type
    try {
      const category_list = await productCategory.findAll();
      await ResponseManager.SuccessResponse(req, res, 200, category_list);
    } catch (err) {
      await ResponseManager.CatchResponse(req, res, err.message);
    }
  }
}

module.exports = ProductController;
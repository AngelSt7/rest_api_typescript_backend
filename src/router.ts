import { Router } from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/product"
import { body, param } from "express-validator"
import { handleInputErrors } from "./middleware"

const router = Router()
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The product name
 *           example: Monitor Curvo de 49 Pulgadas
 *         price:
 *           type: number
 *           description: The price of the product
 *           example: 300
 *         availability:
 *           type: number
 *           description: The product availability
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a List of Products
 *     tags:
 *       - Products
 *     description: Return a List of Products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a Product by ID
 *     tags:
 *       - Products
 *     description: Return a Product based on its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the Product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request - Invalid ID
 */

router.get('/', getProducts)

router.get('/:id', 
    param('id').isNumeric().withMessage("ID no válido"),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *  post: 
 *      summary: Creates a new Product
 *      tags: 
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 49 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399 
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - invalid input data
 */


router.post('/', 
    // Validacion
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('price').
        isNumeric().
        notEmpty().
        withMessage('El precio no puede ir vacio').
        custom((value)=> value > 0).withMessage("El Precio debe ser mayor a 0"),
        handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put: 
 *      summary: Updates a Product with user input
 *      tags: 
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the Product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 49 Pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399 
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 */


router.put('/:id', 
    param('id').isInt().withMessage("ID no válido"),
    body('name')
    .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('price').
        isNumeric().
        notEmpty().
        withMessage('El precio no puede ir vacio').
        custom((value)=> value > 0).withMessage("El Precio debe ser mayor a 0"),
    body('availability')
        .isBoolean().withMessage("Disponibilidad no valida"),
    handleInputErrors,
    updateProduct
)


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Updated Product availability
 *     tags:
 *       - Products
 *     description: Return the updated  availability
 *  parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the Product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 */

router.patch('/:id', 
    param('id').isInt().withMessage("ID no válido"),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product from database
 *     tags:
 *       - Products
 *     description: Returns a message of successful operation
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the Product to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "producto eliminado correctamente"
 *       400:
 *         description: Bad Request - Invalid ID or Invalid input data
 *       404:
 *         description: Product Not Found
 */



router.delete('/:id', 
    param('id').isInt().withMessage("ID no válido"),
    handleInputErrors,
    deleteProduct
)

export default router
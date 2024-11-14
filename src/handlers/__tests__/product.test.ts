import request from 'supertest'
import server, { connectDB } from '../../server'
import db from '../../config/db'

describe('POST /api/products', () => {

    it("should display validation errors", async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that a price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor curvo",
            price: -500
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
    })

    it('should validate that a price is a number greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor curvo",
            price: "Hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mause - testing",
            price: 50
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

    })
})

describe('GET /api/products', () => {
    it('The API should return JSON', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(404)
    })
})

describe('GETT BY ID /api/products', () => {
    it('Should return state 404 response a non-existen product', async () => {

        const productId = 10000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })

    it("Should validate that ID is a number", async () => {

        const response = await request(server).get('/api/products/not-validate-id')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
    })

    it("GET a JSON response for a single product", async () => {

        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe("PUT /api/products/:id", () => {

    it("Should validate that ID is a number", async () => {

        const response = await request(server).put('/api/products/not-validate-id').send({ name: "Monitor Curvo", availability: true, price: 300 })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
    })

    it("should display errors messages when updating a product", async () => {

        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it("should validate that the price is greater than 0", async () => {

        const response = await request(server).put('/api/products/1').send({ name: "Monitor Curvo", availability: true, price: 0 })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it("should return a 404 response for a non-existen product", async () => {

        const productId = 3000
        const response = await request(server).put(`/api/products/${productId}`).send({ name: "Monitor Curvo", price: 3000, availability: true })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it("should update an existing product with valid data", async () => {

        const response = await request(server).put(`/api/products/1`).send({ name: "Monitor Curvo", availability: true, price: 3000 })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000

        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
    })

    it('should return a 404 response for a not-existent product', async () => {

        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Error al borrar producto')
        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {

        const response = await request(server).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')
        expect(response.status).not.toBe(404)
    })
})

//  jest.mock('../../config/db')

//  describe('Connect DB', () => {
//      it('should handle database connection error', async () => {
//          jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Hubo un error al conectarse a la BD'))

//          const consoleSpy = jest.spyOn(console, 'log')

//          await connectDB()

//          expect(consoleSpy).toHaveBeenCalledWith(
//              expect.stringContaining('Hubo un error al conectarse a la BD')
//          )
//      })
//  })
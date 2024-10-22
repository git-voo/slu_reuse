import request from 'supertest'
import express from 'express'
import itemRoutes from '../../routes/itemRoutes.js'
import { jest } from '@jest/globals'
import ItemModel from '../../models/ItemModel.js'
import mongoose from 'mongoose' 

jest.mock('../../models/ItemModel.js')

 

beforeAll(() => { 
    app = express()
    app.use(express.json())
    app.use('/api', itemRoutes)
    ItemModel.findById = jest.fn()
}) 


afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    if (mongoose.connection && mongoose.connection.close) {
        mongoose.connection.close()
    }
})

describe('Item Controller tests #items', () => {
    const mockItem = { _id: '617f1f77bcf86cd799439011', name: 'Test Item', description: 'A test item' }

    it('should get all items', async () => {
        // Mock the find method of ItemModel to return a test item
        ItemModel.find = jest.fn().mockResolvedValue([mockItem])

        const res = await request(app).get('/api/items')  // Send GET request to fetch items
        expect(res.statusCode).toBe(200)  // Expect 200 OK
        expect(res.body).toHaveLength(1)  // Expect 1 item in response
        expect(res.body[0].name).toBe('Test Item')  // Expect the item's name to be 'Test Item'
    })
 
 
    it('should update an existing item', async () => {
        const updatedItem = { ...mockItem, name: 'Updated Item' }
        ItemModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedItem)

        const res = await request(app).put(`/api/items/${mockItem._id}`).send({
            name: 'Updated Item'
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe('Updated Item')
    })

    it('should delete an item', async () => {
        ItemModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockItem)

        const res = await request(app).delete(`/api/items/${mockItem._id}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Item deleted successfully')
    })
 
})
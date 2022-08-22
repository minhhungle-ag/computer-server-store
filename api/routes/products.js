const express = require('express')
const router = express.Router()
const uuid = require('uuid').v4
const productList = require('../../data/products.json')
const fs = require('fs')
const Product = require('../models/product')
const mongoose = require('mongoose')

const currentLimit = 5
const currentPage = 1

function writeToProductsFile(productList) {
    try {
        fs.writeFileSync('./data/products.json', JSON.stringify(productList), () =>
            console.log('Write file success')
        )
    } catch (error) {
        console.log('write file failed: ', error)
    }
}

router.get('/', (req, res, next) => {
    const startIdx = ((req.query.page || currentPage) - 1) * (req.query.limit || currentLimit)
    const limit = req.query.limit || currentLimit

    Product.find()
        .exec()
        .then((docs) => {
            if (Array.isArray(docs)) {
                const total = docs.length
                const totalPage = Math.ceil(docs.length / (req.query.limit || limit))

                res.status(200).json({
                    pagination: {
                        page: req.query.page || page,
                        limit: req.query.limit || limit,
                        total: total,
                        total_page: totalPage,
                    },
                    data: docs.splice(startIdx, req.query.limit || limit).reverse(),
                })
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })
})

router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId)
        .exec()
        .then((doc) => {
            console.log(`From DB id: ${doc._id}`)
            res.status(200).json(doc)
        })
        .catch((error) => {
            res.status(500).json({ error: error.message })
        })
})

router.post('/', async (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        createdAt: new Date().getTime(),
    })

    product
        .save()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log('Failed to add product: ', error)
            res.status(500).json({ error: error.message })
        })
})

router.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.updateOne(
        { _id: productId },
        {
            $set: {
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                updatedAt: new Date().getTime(),
            },
        }
    )
        .exec()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log('Failed to updated product: ', error)
            res.status(500).json({ error: error.message })
        })
})

router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.remove({ _id: productId })
        .exec()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.log('Failed to deleted product: ', error)
            res.status(500).json({ error: error.message })
        })
})

module.exports = router

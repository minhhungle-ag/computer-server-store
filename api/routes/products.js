const express = require('express')
const router = express.Router()
const uuid = require('uuid').v4
const productList = require('../../data/products.json')
const fs = require('fs')

const limit = 5
const page = 1

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
    const startIdx = ((req.query.page || page) - 1) * (req.query.limit || limit)

    const newProductList = [...productList]
    const total = newProductList.length
    const totalPage = Math.ceil(newProductList.length / (req.query.limit || limit))

    res.status(200).json({
        pagination: {
            page: req.query.page || page,
            limit: req.query.limit || limit,
            total: total,
            total_page: totalPage,
        },
        data: newProductList.splice(startIdx, req.query.limit || limit),
    })
})

router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId
    const product = [...productList].find((item) => item.id === productId)
    res.status(200).json(product)
})

router.post('/', async (req, res, next) => {
    const product = {
        id: uuid(),
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        createdAt: new Date().getTime(),
        updatedAt: '',
    }

    const newProductList = [product, ...productList]
    writeToProductsFile(newProductList)
    res.status(200).json(product)
})

router.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId
    const newProductList = [...productList]

    if (!productId || newProductList.length === 0) return

    const idx = newProductList.findIndex((item) => item.id === productId)

    const product = {
        id: productId,
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        createdAt: newProductList[idx].createdAt,
        updatedAt: new Date().getTime(),
    }

    newProductList[idx] = product

    writeToProductsFile(newProductList)

    res.status(200).json(newProductList[idx])
})

router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId
    const newProductList = [...productList]

    if (!productId || newProductList.length === 0) return
    const idx = newProductList.findIndex((item) => item.id === productId)

    newProductList.splice(idx, 1)

    writeToProductsFile(newProductList)

    res.status(200).json({
        message: `DELETED PRODUCT ID ${productId}`,
    })
})

module.exports = router

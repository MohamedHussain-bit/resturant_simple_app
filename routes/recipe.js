const express = require('express')
const Recipe = require('../models/schemaRecipe')
const multer = require('multer')

const router = express.Router()

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , './public/images')
    },
    filename : (req ,file , cb) => {
        const filename = Date.now()+ '-' + file.fieldname
        cb(null , filename)
    }
})

const upload = multer({storage : storage})

router.get('/' , async (req , res) => {
    try{
        const recipes = await Recipe.find()
        return res.status(200).json(recipes)
    }catch(err){
        res.status(400).json(err)
    }
})

router.post('/' , upload.single('coverImage') , async (req , res) => {
    const {title , ingredients , instructions} = req.body
    if(!title || !ingredients || !instructions){
        return res.status(400).json({message : 'All fileds required'})
    }
    const newRecipe = await Recipe.create({
        title,
        ingredients,
        instructions,
    })
    res.status(201).json(newRecipe)
})

router.get('/:id' , async (req , res) => {
    const {id} = req.params
    try{
        const recipe = await Recipe.findById(id)
        if(!recipe){
            return res.status(404).json({error : 'Recipe not found'})
        }
        res.status(200).json(recipe)
    }catch(err){
        res.status(400).json(err)
    }
})

router.put('/:id' , async (req , res) => {
    const {id} = req.params
    const {title , ingredients , instructions} = req.body
    try{
        const updateRicipe = await Recipe.findByIdAndUpdate(id , {
            title,
            ingredients,
            instructions
        } ,{new : true})
        if(!updateRicipe){
            return res.status(404).json({error : 'Recipe not found'})
        }
        res.status(200).json(updateRicipe)
    }catch(err){
        res.status(404).json(err)
    }
})

router.delete('/:id' , async (req , res) => {
    const {id} = req.params
    try{
        const deleteRecipe = await Recipe.findByIdAndDelete(id)
         if(!deleteRecipe){
            return res.status(404).json({error : 'Recipe not found'})
        }
        res.status(200).json({message : 'Recpe deleted successfully'})
    }catch(err){
        res.status(404).json(err)
    }
})

module.exports = router
// implement your posts router here
const express = require('express');
const Posts = require('./posts-model')
const router = express.Router();

router.get('/', (req,res)=>{
    Posts.find()
    .then(found=>{res.json(found)})
    .catch(err => {
        res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message
        })
    })
})

router.get('/:id', async(req,res)=>{
    try{
        const { id } = req.params;
        const post = await Posts.findById(id)
        if(!post){
        res.status(404).json({
            message: 'The post with the specified ID does not exist'
        })
        }
        else{
            res.json(post)
        }
    }
    catch(err){
        res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message
        })
    }
})

router.post('/', (req,res)=>{
    const {title, contents} = req.body
    if(!title || !contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }
    else{
       Posts.insert({title, contents})
       .then(({ id }) => {
           return Posts.findById(id)
       })
       .then(post => {res.status(201).json(post)})
       .catch(err => {
        res.status(500).json({
        message: "There was an error while saving the post to the database",
        err: err.message
        })
    })
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        const { id } = req.params;
        const post = await Posts.findById(id)
        if(!post){
        res.status(404).json({
            message: "The post with the specified ID does not exist"
        })
        }
        else{
            const deletedPost = await Posts.remove(id)
            res.json(post)
        }
    }
    catch(err){
        res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message
        })
    }
})

router.put('/:id', (req,res)=>{
    const { title, contents } = req.body
    if(!title || !contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }
    else{
       Posts.findById(req.params.id)
       .then(post => {
           if(!post){
               res.status(404).json({
                message: "The post with the specified ID does not exist"
               })
           }
           else{
               return Posts.update(req.params.id, req.body)
           }
       })
       .then( post => {
           if(post){
                res.json(post)}}
       )
       .catch(err => {
        res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message
        })
    })
    }
})
// router.get('/', (req,res)=>{})

module.exports = router



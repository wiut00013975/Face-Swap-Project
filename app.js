/*let fs = require('fs')
const express = require('express');
const path = require('path')
const app = express();*/
import dotenv from 'dotenv'
import fs from 'fs'
import express from 'express'
import path from 'path'
const app = express();

dotenv.config();
let PORT = process.env.PORT || 3000;
//const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.post("/setImages", (req,res) => {
    const {swap, target} = req.body;
    setImages(swap, target);
    res.send("Images set successfully.");
})

app.get("/generateImage", async (req, res) => {
    await generateImage();
    res.send("Image generation initiated.");
})

app.get("/getGeneratedImageUrl", (req, res)=> {
    res.json(getGeneratedImageUrl())
})

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(PORT, error => {
    if(error) throw error
    console.log(`App is available via http://localhost:${PORT}`)
})

import Replicate from "replicate"
const replicate = new Replicate({
    auth: process.env.Replicate_API_TOKEN,
});

let swapImage;
let targetImage;
let generatedImageUrl;

export function setImages(swap, target){
    swapImage = swap;
    targetImage = target;
}

export function getGeneratedImageUrl(){
    return generatedImageUrl;
}

export async function generateImage(){
    if (!swapImage || !targetImage){
        console.error("Swap and target images are required.")
        return;
    }
    const inputParams = {
        input: {
            swap_image: swapImage,
            target_image: targetImage,
        }
    };
    try {
        const output = await replicate.run(
            "omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe",
            inputParams
        );
        generatedImageUrl = output;
    }
    catch(error){
        console.error("error generating image:", error);
    }
}
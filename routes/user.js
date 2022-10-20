import express from "express";

import {signup,signin,forget,reset} from "../controller/user.js";

const router = express.Router();

//post


router.post("/signup", signup);
router.post("/forget",forget)
router.post("/signin", signin);
router.post("/reset/:userId/:token",reset);


export default router;


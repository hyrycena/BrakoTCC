import { Router } from "express";
import { get, post, delet,getTudo } from "./controller.js";

const router = Router();

router.get("/", get);
router.get("/pega-candidatos", getTudo);
router.post("/criar-canditada", post)
router.delete("/:id", delet);

export default router;
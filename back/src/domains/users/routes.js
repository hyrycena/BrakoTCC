import { Router } from "express";
import { get, post, getbyid, deletar, put,getDadoLogin } from "./controller.js";

const router = Router();

router.get("/", get);
router.get("/dados", getDadoLogin);
router.post("/", post);
router.get("/:id", getbyid);
router.put("/", put);
router.delete("/:id", deletar);

export default router;

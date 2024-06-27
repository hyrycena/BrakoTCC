import { Router } from "express";
import { get, post, getbyid, delet, put, getVagasCriadas } from "./controller.js";

const router = Router();

router.get("/", get);
router.get("/cridas", getVagasCriadas);
router.post("/", post);
router.get("/:id", getbyid);
router.put("/:id", put);
router.delete("/:id", delet);

export default router;

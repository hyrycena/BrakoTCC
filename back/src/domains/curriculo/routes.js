import { Router } from "express";
import { post} from "./controller.js";

const router = Router();

router.post("/", post);


export default router;

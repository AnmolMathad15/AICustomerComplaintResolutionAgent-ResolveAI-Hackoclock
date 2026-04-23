import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import resolveaiRouter from "./resolveai.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resolveaiRouter);

export default router;

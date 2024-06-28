import { Router } from "express";
import { urlController } from "../controllers/url-controller";

const router = Router();

router.get("/url/:shortened?", urlController.getUrl.bind(urlController));
router.get("/urls/:id?", urlController.getUrls.bind(urlController));
router.post("/url", urlController.createUrl.bind(urlController));
router.post("/url/custom", urlController.createCustomUrl.bind(urlController));
router.patch("/url/:id?", urlController.updateUrl.bind(urlController));
router.delete("/url/:id?", urlController.deleteUrl.bind(urlController));

export default router;
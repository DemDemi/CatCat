import { Router } from "express";

import { Index_Controller } from "./controllers/index.js";

const router = new Router()

router.get('/',  Index_Controller.index)

router.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
  });

export default router
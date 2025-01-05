import { Router } from "express";

import { Index_Controller } from "./controllers/index.js";
import { Spam_Controller } from "./controllers/spam.js";

const router = new Router()

router.get('/',  Index_Controller.index)

router.get('/spam_start',  Spam_Controller.start)
router.get('/spam_end',  Spam_Controller.end)

router.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
  });

export default router
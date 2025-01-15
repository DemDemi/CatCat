import { Router } from "express";

import { Index_Controller } from "./controllers/index.js";

import  Music_Controller  from "./controllers/music.js";
import  Stickers_Controller  from "./controllers/stickers.js";

const router = new Router()

router.get('/',  Index_Controller.index)

router.post('/music/upload_mp3',  Music_Controller.upload_mp3)
router.post('/music/upload_poster',  Music_Controller.upload_poster)
router.post('/music/delete',  Music_Controller.delete)

router.post('/sticker/upload',  Stickers_Controller.upload)
router.post('/sticker/folder_names',  Stickers_Controller.get_sticker_folder_names)
router.post('/sticker/delete',  Stickers_Controller.delete)


router.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
  });

export default router

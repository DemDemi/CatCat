import { Stickers_Controller } from "../services/stickers.js"
import { Music_Service } from "../services/music.js"
class index_controller {


    async index(req, res) {

        const passcode = req.query.u
        const stickers = await Stickers_Controller.get_stickers(passcode)
        const music_collections = await Music_Service.get_collections()
        
        const APP_DOMAIN = process.env.HOST + process.env.PORT
        const APP_URL = process.env.APP_URL
        res.render('index', {
            music_collections,
            stickers,
            APP_DOMAIN,
            APP_URL
        })
    }



}

export const Index_Controller = new index_controller()
import { Stickers_Service } from "../services/stickers.js"
import { Music_Service } from "../services/music.js"
import USERS_SERVICE from "../services/users.js"

class index_controller {

    async index(req, res) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        const passcode = req.query.u
        const stickers = await Stickers_Service.get_stickers(passcode)
        const music_collections = await Music_Service.get_collections()
        const rooms =  USERS_SERVICE.get_rooms()

        const APP_DOMAIN = process.env.HOST + process.env.PORT
        const APP_URL = process.env.APP_URL
        res.render('index', {
            music_collections,
            stickers,
            rooms,
            APP_DOMAIN,
            APP_URL
        })
    }



}

export const Index_Controller = new index_controller()
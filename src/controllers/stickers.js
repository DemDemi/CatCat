import { Stickers_Service } from "../services/stickers.js"





class Stickers_controller {


    async get_collections(req, res) {
        try {
            const stickers = await Stickers_Service.get_collections()
            res.status(200).send(
                JSON.stringify(stickers)
            );
        } catch (error) {
            console.log(error)
            res.status(404).send('File fund');
        }

    }


    async upload(req, res) {
        try {
            if(process.env.SECRET != req.body.token) {
                res.status(403).send('Paroli dagaviwyda Sechemiau ?');
                return
            }
            const file = req.files.file
            const collection_name = req.body.collection_name
            const path = await Stickers_Service.upload(file, collection_name)
            res.send(path)
        } catch (error) {
            console.log(error)
            res.status(404).send('File not  fund');
        }
    }

    async get_sticker_folder_names(req, res) {
        try {
            if(process.env.SECRET != req.body.token) {
                res.status(403).send('Paroli dagaviwyda Sechemiau ?');
                return
            }
            const names = await Stickers_Service.get_sticker_folder_names()
            res.send(JSON.stringify(names))
        } catch (error) {
            console.log(error)
            res.status(404).send('File not  fund');
        }
    }

    
    async delete(req, res) {
        try {
            console.log(req.body)
            if(process.env.SECRET != req.body.token) {
                res.status(403).send('Paroli dagaviwyda Sechemiau ?');
                return
            }
            const path = req.body.path
            const data = await Stickers_Service.delete(path)
            res.send(JSON.stringify(data))
        } catch (error) {
            console.log(error)
            res.status(404).send('File not  fund');
        }
    }
  
}

const Stickers_Controller = new Stickers_controller()
export default Stickers_Controller



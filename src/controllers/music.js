import { Music_Service } from "../services/music.js"





class Music_controller {

    async upload_mp3(req, res) {
        try {
            if(process.env.SECRET != req.body.token) {
                res.status(403).send('Paroli dagaviwyda Sechemiau ?');
                return
            }
            const file = req.files.file
            const collection_name = req.body.collection_name
            const path = await Music_Service.upload_mp3(file, collection_name)
            res.send(path)
        } catch (error) {
            console.log(error)
            res.status(404).send('File not  fund');
        }
    }

    async upload_poster(req, res) {
        try {
            if(process.env.SECRET != req.body.token) {
                res.status(403).send('Paroli dagaviwyda Sechemiau ?');
                return
            }
            const file = req.files.file
            const collection_name = req.body.collection_name
            const path = await Music_Service.upload_mp3(file, collection_name)
            res.send(path)
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
            const data = await Music_Service.delete(path)
            res.send(JSON.stringify(data))
        } catch (error) {
            console.log(error)
            res.status(404).send('File not  fund');
        }
    }
  
}

const Music_Controller = new Music_controller()
export default Music_Controller



import fs from 'fs'
import path from 'path';
const __dirname = path.resolve()

const stickers_path = path.join(__dirname, 'public/static/stickers')
const public_stickers_path = 'static/stickers'




class Stickers_controller {

    async get_stickers() {
        let stickers = []
        let folder_names = await this.get_sticker_folder_names()
    
        for (let i = 0; i < folder_names.length; i++) {
            const dir = path.join(stickers_path, folder_names[i])
            const sticker_names = await this.get_sticker_names(dir)
            let collection = []
            sticker_names.forEach(sticker_name => {  
                collection.push({
                    public_path: path.join(public_stickers_path, folder_names[i], sticker_name)
                })
            });
            stickers.push(collection)
        }
        return stickers
    }

    get_sticker_names(dir) {
        return new Promise((resolve) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    resolve([])
                } else {
                    resolve(files)
                }
            });
        });    
    }




    get_sticker_folder_names() {
        return new Promise((resolve) => {
            fs.readdir(stickers_path, (err, files) => {
                if (err) {
                    console.log(err);
                    resolve([])
                } else {
                    let names = []
                    files.forEach(file => {
                        names.push(file)
                    })
                    resolve(names) 
                }
            })
        });
    }

}

export const Stickers_Controller = new Stickers_controller()
import fs from 'fs'
import path from 'path';
import { rimraf } from 'rimraf'
const __dirname = path.resolve()

const stickers_path = path.join(__dirname, 'public/static/stickers')
const public_stickers_path = 'static/stickers'




class Stickers_service {

    async upload(file, collection_name) {
        try {
            if (!fs.existsSync(path.resolve(stickers_path, collection_name))) {
                fs.mkdirSync(path.resolve(stickers_path, collection_name));
            }
            const file_name = file.name
            const file_path = path.resolve(stickers_path, collection_name, file_name)
            file.mv(file_path)
            return {
                path: file_path + file_name
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async delete(file_path) {
        try {
            rimraf.sync(path.resolve(file_path));
            return path
        } catch (error) {
            console.log(error)
            return null
        }
    }


    async get_collections() {
        try {
            let stickers = []
            let folder_names = await this.get_sticker_folder_names()

            for (let i = 0; i < folder_names.length; i++) {
                const name = folder_names[i]
                const dir = path.join(stickers_path, folder_names[i])
                const sticker_names = await this.get_sticker_names(dir)
                let collection = []
                sticker_names.forEach(sticker_name => {
                    collection.push({
                        public_path: path.join(public_stickers_path, folder_names[i], sticker_name)
                    })
                });
                stickers.push({
                    name: name,
                    preview: collection[0] ?? null,
                    collection: collection
                })
            }
            return stickers
        } catch (error) {
            console.log(error)
        }
    }

    get_sticker_names(dir) {
        try {
            return new Promise((resolve) => {
                fs.readdir(dir, (err, files) => {
                    if (err) {
                        resolve([])
                    } else {
                        resolve(files)
                    }
                });
            });
        } catch (error) {
            console.log(error)
        }
    }

    async get_stickers() {
        try {
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
        } catch (error) {
            console.log(error)
        }

    }






    get_sticker_folder_names() {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

}

export const Stickers_Service = new Stickers_service()
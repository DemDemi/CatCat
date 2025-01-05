import fs from 'fs'
import path from 'path';
const __dirname = path.resolve()


class Music_service {

    collections_mp3_path = path.join(__dirname, 'public/mp3')
    collections_posters__path = path.join(__dirname, 'public/mp3_posters')

    collections_posters_public_path = 'mp3_posters'
    collections_mp3_public_path = 'mp3'
    collection_poster_name = 'poster.jpg'
    no_music_poster_public_path = path.join('static', 'no_music_poster.jpg')


    async search_music(query) {
        try {
            let music_collections = await this.get_collections()
            let musics = []
            music_collections.forEach(music_collection => {
                music_collection.collection.forEach(music => {
                    if (music.name.toLowerCase().includes(query.toLowerCase())) {
                        musics.push(music)
                    }
                });
            });
            return musics
        } catch (error) {
            console.log(error)
        }

    }


    async get_collections() {
        try {
            let music_collections = []
            let collection_names = await this.get_collection_names(this.collections_mp3_path)
            for (let i = 0; i < collection_names.length; i++) {
                const collection_name = collection_names[i]
                const collection = await this.get_music_collection(collection_name)
                music_collections.push(collection)
            }
            return music_collections
        } catch (error) {
            console.log()
        }

    }

    async get_music_collection(collection_name) {
        try {
            const collection_musics_path = path.join(this.collections_mp3_path, collection_name)
            const collection_posters_path = path.join(this.collections_posters__path, collection_name)
            const music_names = await this.get_collection_mp3(collection_musics_path)
            const music_poster_names = await this.get_collection_poster(collection_posters_path)
            let musics = []
            music_names.forEach(music_name => {
                const poster_name = this.find_music_poster_name(music_name, music_poster_names)
                const music = new Music({
                    name: music_name.slice(0, - 4),
                    mp3_public_path: path.join(this.collections_mp3_public_path, collection_name, music_name),
                    poster_public_path: poster_name ? path.join(this.collections_posters_public_path, collection_name, poster_name) : this.no_music_poster_public_path
                })
                musics.push(music)
            });
            const collection = new Music_collection({
                name: collection_name,
                poster_public_path: path.join(this.collections_posters_public_path, collection_name, this.collection_poster_name),
                collection: musics
            })
            return collection
        } catch (error) {
            console.log(error)
        }
    }

    find_music_poster_name(music_name, poster_names) {
        try {
            const name = music_name.slice(0, - 4)
            const poster_name = poster_names.find(m => m.includes(name))
            return poster_name
        } catch (error) {
            console.log(error)
        }
    }

    get_collection_mp3(collection_musics_path) {
        try {
            return new Promise((resolve) => {
                fs.readdir(collection_musics_path, (err, files) => {
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

    get_collection_poster(collection_posters_path) {
        try {
            return new Promise((resolve) => {
                fs.readdir(collection_posters_path, (err, files) => {
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




    get_collection_names(collections_path) {
        try {
            return new Promise((resolve) => {
                fs.readdir(collections_path, (err, files) => {
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

export const Music_Service = new Music_service()

class Music_collection {
    name;
    poster_public_path;
    collection = []
    constructor(data) {
        this.name = data?.name ?? null
        this.poster_public_path = data?.poster_public_path ?? null
        this.collection = data.collection
    }
}

class Music {
    name;
    poster_public_path;
    mp3_public_path;
    constructor(data) {
        this.name = data?.name ?? null
        this.poster_public_path = data?.poster_public_path ?? null
        this.mp3_public_path = data?.mp3_public_path ?? null
    }
}
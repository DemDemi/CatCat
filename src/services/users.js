import { Music_Service } from "./music.js"


class Users_Service {

    constructor() {
        setInterval(() => {
            this.#chat_connection_interval()
        }, 1000);
    }
    #chats = []
    #users = []
    #jeirani = []
    #game_jeirani_rules = {
        item_1: {
            item_1: null,
            item_2: true,
            item_3: false,
            item_4: false,
            item_5: true,
        },
        item_2: {
            item_1: false,
            item_2: null,
            item_3: true,
            item_4: false,
            item_5: true,
        },
        item_3: {
            item_1: true,
            item_2: false,
            item_3: null,
            item_4: true,
            item_5: false,
        },
        item_4: {
            item_1: true,
            item_2: true,
            item_3: false,
            item_4: null,
            item_5: false,
        },
        item_5: {
            item_1: false,
            item_2: false,
            item_3: true,
            item_4: true,
            item_5: null,
        }
    }
    // =============================================================> STATE ACTIONS START

    //===== users
    find_or_create(socket) {
        let user = this.#users.find(u => u.socket_id == socket.id)
        if (user) return user
        user = new User(socket)
        this.#users.push(user)
        return user
    }
    #get_user_by_socket_id(socket_id) {
        const user = this.#users.find(u => u.socket_id == socket_id)
        return user
    }
    #update_user(user) {
        let new_users = []
        for (let i = 0; i < this.#users.length; i++) {
            const u = this.#users[i];
            if (u.socket_id == user.socket_id) {
                new_users.push(user)
            } else {
                new_users.push(u)
            }
        }
        this.#users = new_users
    }
    #delete_user(socket_id) {
        this.#users = this.#users.filter(u => u.socket_id != socket_id)
    }

    #set_chat(chat) {
        this.#chats = [...this.#chats, chat]
    }
    #get_chat_by_id(id) {
        const chat = this.#chats.find(t => t.id == id)
        return chat
    }
    #update_chat(chat) {
        let new_chats = []
        for (let i = 0; i < this.#chats.length; i++) {
            if (this.#chats[i].id == chat.id) {
                new_chats.push(chat)
            } else {
                new_chats.push(this.#chats[i])
            }
        }
        this.#chats = new_chats
    }
    #delete_chat_by_id(id) {
        this.#chats = this.#chats.filter(d => d.id != id)
    }
    // =============================================================> STATE ACTIONS END


    // ======================================================================================> CREATE DUBLE CHAT START

    disconnect_user(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        if (sender.chat_id) this.disconnect_user_from_chat(sender.socket_id, sender.chat_id)
        this.#delete_user(socket_id)
    }

    set_user_offline(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        if (sender.chat_id) this.disconnect_user_from_chat(sender.socket_id, sender.chat_id)
    }

    set_user_online(socket_id) {
        let user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.set_chat_id(null)
        user.set_is_active(true)
        this.#update_user(user)
    }

    #chat_connection_interval() {
        const target_users = this.#users.filter(u =>
            u.active == true && u.chat_id == null
        )
        if(target_users.length == 1) {
            const free_chat = this.#find_free_chat()
            if(free_chat) this.#connect_user_to_free_chat(target_users[0], free_chat)
        }
        if (target_users.length >= 2) {
            this.#create_chat(
                target_users[0],
                target_users[1]
            )
        }
    }

    #find_free_chat() {
        const free_chats = this.#chats.filter( c => c.is_full == false )
        if(free_chats.length == 0) return null
        if(free_chats.length > 0) {
            return free_chats[this.#get_randon_int(free_chats.length)]
        }
    }

    #connect_user_to_free_chat(user, chat) {
        let socket_ids = [...chat.socket_ids, user.socket_id]
        chat.set_socket_ids(socket_ids)
        this.#update_chat(chat)
        user.set_chat_id(chat.id)
        user.set_is_active(false)
        this.#update_user(user)
        this.send_messages({
            socket_id: user.socket_id,
            bot_success: true,
            connect: true,
            center: true,
            message: `ჩათში ${socket_ids.length} კაცია ვიღაც შემოვიდა`
        })
        this.send_users_count()
    }

    #create_chat(user_1, user_2) {
        const chat = new Chat()
        chat.set_socket_ids([user_1.socket_id, user_2.socket_id])
        this.#set_chat(chat)
        user_1.set_chat_id(chat.id)
        user_1.set_is_active(false)
        this.#update_user(user_1)
        user_2.set_chat_id(chat.id)
        user_2.set_is_active(false)
        this.#update_user(user_2)
        this.send_messages({
            socket_id: user_1.socket_id,
            bot_success: true,
            connect: true,
            message: 'თანამოსაუბრე ნაპოვნია'
        })
        this.send_users_count()
    }

    disconnect_user_from_chat(socket_id, chat_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        const chat = this.#get_chat_by_id(chat_id)
        if (!chat) return
        if(chat.users_count == 2) {
            chat.socket_ids.forEach(socket_id => {
                const user = this.#get_user_by_socket_id(socket_id)
                if (!user) return
                user.set_is_active(false)
                user.set_chat_id(null)
                user.socket.send(
                    new Message({
                        bot: true,
                        disconnect: true,
                        message: true
                    })
                )
                this.#update_user(user)
                this.#delete_chat_by_id(chat.id)
            });
        } else {
            chat.socket_ids.forEach(socket_id => {
                const user = this.#get_user_by_socket_id(socket_id)
                if (!user) return
                if(user.socket_id == sender.socket_id) {
                    user.set_is_active(false)
                    user.set_chat_id(null)
                    sender.socket.send(
                        new Message({
                            bot: true,
                            disconnect: true,
                            message: true
                        })
                    )
                    this.#update_user(user)
                } else {
                    user.socket.send(
                        new Message({
                            bot_danger: true,
                            center: true,
                            message: `ჩათში ${( chat.socket_ids.length - 1 )} კაცია ვიღაცა გავიდა`
                        })
                    )
                }
            });
        }
        chat.set_socket_ids(chat.socket_ids.filter( s => s != socket_id )) 
        chat.set_users_max_count(chat.socket_ids.length)
        this.#update_chat(chat)
        this.send_users_count()
    }

    async open_chat_request(socket_id, max_users) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        const chat = this.#get_chat_by_id(sender.chat_id)
        if(!chat) return
        this.send_messages({
            socket_id: sender.socket_id,
            open_chat_request: true,
            max_users: max_users,
            bot_success: true,
            message: `ჩათი გავხსნათ ${max_users} კაცზე`
        })
    }

    async open_chat_accept(socket_id, max_users) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        const chat = this.#get_chat_by_id(sender.chat_id)
        if(!chat) return
        chat.set_users_max_count(max_users)
        console.log(max_users)
        this.#update_chat(chat)
        this.send_messages({
            socket_id: sender.socket_id,
            bot_success: true,
            message: `ჩათი გაიხსნა`
        })
    }

    async open_chat_decline(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        this.send_messages({
            socket_id: sender.socket_id,
            bot_danger: true,
            message: `არა მადლობა`
        })
    }

    send_sticker(socket_id, public_path) {
        this.send_messages({
            socket_id: socket_id,
            sticker: public_path,
            message: true
        })
    }

    send_messages(data) {
        if(data.message.length < 2) return
        const sender = this.#get_user_by_socket_id(data.socket_id)
        if (!sender) return
        const chat = this.#get_chat_by_id(sender.chat_id)
        if(!chat) return
        chat.socket_ids.forEach(socket_id => {
            const user = this.#get_user_by_socket_id(socket_id)
            if (!user) return

            const message = new Message({
                // open chat
                vouting: data.vouting ?? null,
                open_chat_accept: data.open_chat_accept ?? null,
                open_chat_request: data.open_chat_request ?? null,
                max_users: data.max_users ?? null,
                // connection 
                disconnect: data.disconnect ?? false,
                connect: data.connect ?? false,
                // styles
                bot_danger: data.bot_danger ?? null,
                bot_success: data.bot_success ?? null,
                center: data.center ?? false,
                right: sender.socket_id == socket_id ? true : false,
                // sender info
                user_img: sender.img,
                user_name: sender.name ?? null,
                // actions
                sticker: data.sticker ?? null,
                jeirani: data.jeirani,
                music: data.music ?? null,
                music_accept: data.music_accept,
                message: data.message
            })
            user.socket.send(message)
        });
    }

    // music_actions ====================================> START
    async sharing_music_request(socket_id, accept) {
        let message = accept ? 'კარგი ჩავრთე' : 'არა მადლობა'
        this.send_messages({
            music: true,
            music_accept: accept,
            socket_id: socket_id,
            message: message
        })
    }

    async sharing_music(socket_id, music, index, collection) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        const chat = this.#get_chat_by_id(sender.chat_id)
        if(!chat) return
        this.send_messages({
            music: true,
            socket_id: sender.socket_id,
            message: 'იქეთ მაგიდიდან სიმღერა მოგიძღვნეს'
        })
        chat.socket_ids.forEach(id => {
            const user = this.#get_user_by_socket_id(id)
            if(user.socket_id == sender.socket_id) return
            user.socket.send({
            sharing_music: true,
            music: music,
            index: index,
            collection: collection,
            title: 'იქეთ მაგიდიდან სიმღერა მოგიძღვნეს'
        })
        });


    }

    async search_music(socket_id, query) {
        const musics = await Music_Service.search_music(query)
        const user = await this.#get_user_by_socket_id(socket_id)
        user.socket.send({
            search_music: true,
            musics: musics
        })
    }
    async get_music_collection(socket_id, name) {
        const music_collection = await Music_Service.get_music_collection(name)
        const user = await this.#get_user_by_socket_id(socket_id)
        user.socket.send({
            get_music_collection: true,
            music_collection
        })
    }

    #check_jeirani_started(socket_id) {
        let target_game = null
        this.#jeirani.forEach(game => {
            let players = game.players
            if (players.some(s => s.socket_id == socket_id)) {
                target_game = game
            }
        });
        return target_game
    }

    #validate_game_jeirani(game) {
        let players = []
        game.players.forEach(i => {
            let socket_id = i.socket_id
            let img_index = i.img_index
            let user_item = `item_${img_index}`
            let user_item_rules = this.#game_jeirani_rules[user_item]
            players.push({
                socket_id: socket_id,
                item: user_item,
                img_index: img_index,
                item_rules: user_item_rules,
                results: []
            })
        });

        let results = []
        players.forEach(player => {
            const result = get_results(player)
            results.push(result)
        });
        function get_results(current) {
            let player = current
            players.forEach(p => {
                if (player.socket_id != p.socket_id) {
                    player.results.push(player.item_rules[p.item])
                }
            });
            return player
        }
        return results
    }

    play_jeirani(socket_id, img_index) {
        let game = this.#check_jeirani_started(socket_id)
        if (game) {
            let all_ready = true
            game.players.forEach((i, index) => {
                if (i.socket_id == socket_id) {
                    game.players[index].img_index = img_index
                }
                if (i.img_index == null) all_ready = false
            })
            if (!all_ready) return
            const results = this.#validate_game_jeirani(game)
            this.#send_jeirani_results(results)
            this.#remove_ended_jeirani_game(game.id)

        } else {
            const sender = this.#get_user_by_socket_id(socket_id)
            const chat = this.#get_chat_by_id(sender.chat_id)
            const jeireni = new Jeirani()
            chat.socket_ids.forEach(socket_id => {
                jeireni.players.push({
                    socket_id: socket_id,
                    img_index: socket_id == sender.socket_id ? img_index : null
                })
            });
            this.#jeirani = [...this.#jeirani, jeireni]
            this.send_messages({
                socket_id: sender.socket_id,
                jeirani: true,
                bot_success: true,
                message: 'მოდი ჯეირანი ვითამაშოთ'
            })
        }
    }

    end_jeirani(socket_id) {
        let target_game = null
        this.#jeirani.forEach(game => {
            let players = game.players
            if (players.some(s => s.socket_id == socket_id)) {
                target_game = game
            }
        });
        if (!target_game) return
        this.#jeirani = this.#jeirani.filter(g => g.id != target_game.id)
        this.send_messages({
            jeirani: false,
            bot_danger: true,
            socket_id: socket_id,
            message: 'არმინდა თამაში',
        })
    }

    #remove_ended_jeirani_game(id) {
        this.#jeirani = this.#jeirani.filter(g => g.id != id)
    }

    #send_jeirani_results(results) {
        let is_draw = false
        let item_images = []
        results.forEach(player => {
            item_images.push(`./static/games/jeirani_${player.img_index}.png`)
            if (player.results.includes(true) && player.results.includes(false)) is_draw = true
            if (!player.results.includes(true) && !player.results.includes(false) && player.results.includes(null)) is_draw = true

        });
        results.forEach(player => {
            let user = this.#get_user_by_socket_id(player.socket_id)
            if (!user) return
            user.socket.send({
                jeirani_result: true,
                item_images: item_images,
                win: is_draw ? null : player.results.includes(true) ? true : false,
                message: is_draw ? 'ფრე' : player.results.includes(true) ? 'მოიგე' : 'წააგე'
            })
        });
    }

    send_users_count() {
        const users_count = this.#users.length
        let duble_count = 0
        let triple_count = 0
        let quadra_count = 0
        let penta_count = 0
        this.#chats.forEach(chat => {
            if(chat.users_count == 2) duble_count ++
            if(chat.users_count == 3) triple_count ++
            if(chat.users_count == 4) quadra_count ++
            if(chat.users_count == 5) penta_count ++
        });

        for (let i = 0; i < this.#users.length; i++) {
            const socket = this.#users[i].socket
            socket.send({
                users_info: true,
                users_count,
                duble_count,
                triple_count,
                quadra_count,
                penta_count
            })
        }
    }

    save_name(socket_id, name) {
        let user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.name = name
        this.#update_user(user)
        return user
    }

    save_img(socket_id, src) {
        let user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.img = src
        this.#update_user(user)
        return user
    }

    #get_randon_int(max) {
        return Math.floor(Math.random() * max);
    }


}

const USERS_SERVICE = new Users_Service()
export default USERS_SERVICE


class User {
    user;
    chat_id;
    active;
    socket;
    socket_id;
    name;
    img;
    constructor(socket) {
        this.user = true // for connet trigger
        this.chat_id = null
        this.active = false
        this.socket = socket
        this.socket_id = socket.id
        this.name = null
        this.img = './static/no_img.jpg'
    }
    set_chat_id(id) {
        this.chat_id = id
    }
    set_is_active(bool) {
        this.active = bool
    }
}

class Message {
    vouting
    open_chat_accept
    open_chat_request;
    max_users;
    bot_success
    bot_danger
    sticker;
    music;
    music_accept;
    jeirani;
    user_img;
    disconnect;
    connect;
    bot;
    right;
    center;
    message;
    date;
    constructor(data) {
        this.vouting = data.vouting ?? null
        this.open_chat_accept = data.open_chat_accept ?? null
        this.open_chat_request = data.open_chat_request ?? null
        this.max_users = data.max_users ?? null
        this.bot_danger = data.bot_danger ?? null
        this.bot_success = data.bot_success ?? null
        this.jeirani = data.jeirani ?? null
        this.music = data.music ?? null
        this.music_accept = data.music_accept ?? null
        this.sticker = data.sticker ?? null
        this.user_img = data.user_img ?? './static/no_img.jpg'
        this.disconnect = data.disconnect ?? false
        this.connect = data.connect ?? false
        this.bot = data.bot ?? false
        this.right = data.right ?? false
        this.center = data.center ?? null
        this.message = data.message ?? null
        this.date = this.#get_time()
    }

    #get_time() {
        let date = new Date(Date.now());
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return hours + ':' + minutes
    }
}

class Chat {
    id;
    is_full;
    users_max_count;
    users_count;
    socket_ids;
    constructor() {
        this.id = Date.now()
        this.is_full = false
        this.users_max_count = 2
        this.users_count = 0
        this.socket_ids = []
    }
    set_users_max_count(count) {
        this.users_max_count = count
        if(this.socket_ids.length == this.users_max_count) {
            this.is_full = true
        } else {
            this.is_full = false
        }
    }
    set_socket_ids(ids) {
        this.socket_ids = ids
        this.users_count = ids.length
        if(this.socket_ids.length == this.users_max_count) {
            this.is_full = true
        } else {
            this.is_full = false
        }
    }
}

class Jeirani {
    id;
    players;
    constructor(data) {
        this.id = Date.now()
        this.players = []
    }
}

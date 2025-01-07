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
        try {
            let user = this.#users.find(u => u.socket_id == socket.id)
            if (user) return user
            user = new User(socket)
            this.#users.push(user)
            return user
        } catch (error) {
            console.log(error)
        }
    }
    #get_user_by_socket_id(socket_id) {
        try {
            const user = this.#users.find(u => u.socket_id == socket_id)
            return user
        } catch (error) {
            console.log(error)
        }

    }
    #update_user(user) {
        try {
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
        } catch (error) {
            console.log(error)
        }

    }
    #delete_user(socket_id) {
        try {
            this.#users = this.#users.filter(u => u.socket_id != socket_id)
        } catch (error) {
            console.log(error)
        }

    }

    #set_chat(chat) {
        try {
            this.#chats = [...this.#chats, chat]
        } catch (error) {
            console.log(error)
        }
    }
    #get_chat_by_id(id) {
        try {
            const chat = this.#chats.find(t => t.id == id)
            return chat
        } catch (error) {
            console.log(error)
        }

    }
    #update_chat(chat) {
        try {
            let new_chats = []
            for (let i = 0; i < this.#chats.length; i++) {
                if (this.#chats[i].id == chat.id) {
                    new_chats.push(chat)
                } else {
                    new_chats.push(this.#chats[i])
                }
            }
            this.#chats = new_chats
        } catch (error) {
            console.log(error)
        }


    }
    #delete_chat_by_id(id) {
        try {
            this.#chats = this.#chats.filter(d => d.id != id)
        } catch (error) {
            console.log(error)
        }

    }
    // =============================================================> STATE ACTIONS END


    // ======================================================================================> CREATE DUBLE CHAT START

    disconnect_user(socket_id) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            if (sender.chat_id) this.disconnect_user_from_chat(sender.socket_id, sender.chat_id)
            this.#delete_user(socket_id)
        } catch (error) {
            console.log(error)
        }

    }

    set_user_offline(socket_id) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            if (sender.chat_id) this.disconnect_user_from_chat(sender.socket_id, sender.chat_id)
        } catch (error) {
            console.log(error)
        }

    }

    set_user_online(socket_id) {
        try {
            let user = this.#get_user_by_socket_id(socket_id)
            if (!user) return
            user.set_chat_id(null)
            user.set_is_active(true)
            this.#update_user(user)
        } catch (error) {
            console.log(error)
        }

    }

    #chat_connection_interval() {
        try {
            const target_users = this.#users.filter(u =>
                u.active == true && u.chat_id == null
            )
            if (target_users.length == 1) {
                const free_chat = this.#find_free_chat()
                if (free_chat) this.#connect_user_to_free_chat(target_users[0], free_chat)
            }
            if (target_users.length >= 2) {
                this.#create_chat(
                    target_users[0],
                    target_users[1]
                )
            }
        } catch (error) {
            console.log(error)
        }

    }

    #find_free_chat() {
        try {
            const free_chats = this.#chats.filter(c => c.is_full == false)
            if (free_chats.length == 0) return null
            if (free_chats.length > 0) {
                return free_chats[this.#get_randon_int(free_chats.length)]
            }
        } catch (error) {
            console.log(error)
        }

    }

    #connect_user_to_free_chat(user, chat) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    #create_chat(user_1, user_2) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    disconnect_user_from_chat(socket_id, chat_id) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            const chat = this.#get_chat_by_id(chat_id)
            if (!chat) return
            if (chat.users_count == 2) {
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
                    if (user.socket_id == sender.socket_id) {
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
                                message: `ჩათში ${(chat.socket_ids.length - 1)} კაცია ვიღაცა გავიდა`
                            })
                        )
                    }
                });
            }
            chat.set_socket_ids(chat.socket_ids.filter(s => s != socket_id))
            chat.set_users_max_count(chat.socket_ids.length)
            this.#update_chat(chat)
            this.send_users_count()
        } catch (error) {
            console.log(error)
        }
    }

    async open_chat_request(socket_id, max_users) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            const chat = this.#get_chat_by_id(sender.chat_id)
            if (!chat) return
            this.send_messages({
                socket_id: sender.socket_id,
                open_chat_request: true,
                max_users: max_users,
                bot_success: true,
                message: `ჩათი გავხსნათ ${max_users} კაცზე`
            })
        } catch (error) {
            console.log(error)
        }


    }

    async open_chat_accept(socket_id, max_users) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            const chat = this.#get_chat_by_id(sender.chat_id)
            if (!chat) return
            chat.set_users_max_count(max_users)
            console.log(max_users)
            this.#update_chat(chat)
            this.send_messages({
                socket_id: sender.socket_id,
                bot_success: true,
                message: `ჩათი გაიხსნა`
            })
        } catch (error) {
            console.log(error)
        }

    }

    async open_chat_decline(socket_id) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            this.send_messages({
                socket_id: sender.socket_id,
                bot_danger: true,
                message: `არა მადლობა`
            })
        } catch (error) {
            console.log(error)
        }

    }

    send_sticker(socket_id, public_path) {
        try {
            this.send_messages({
                socket_id: socket_id,
                sticker: public_path,
                message: true
            })
        } catch (error) {
            console.log(error)
        }

    }

    send_messages(data) {
        try {
            if (data.message.length < 2) return
            const sender = this.#get_user_by_socket_id(data.socket_id)
            if (!sender) return
            const chat = this.#get_chat_by_id(sender.chat_id)
            if (!chat) return
            chat.socket_ids.forEach(socket_id => {
                const user = this.#get_user_by_socket_id(socket_id)
                if (!user) return

                let is_pidarasti = false

                if (data.message && data.message != true) {
                    if (data.message.includes('გეი')) is_pidarasti = true
                    if (data.message.includes('gei')) is_pidarasti = true
                    if (data.message.includes('pasi var')) is_pidarasti = true
                    if (data.message.includes('პასი ვარ')) is_pidarasti = true
                    if (data.message.includes('mogiwov')) is_pidarasti = true
                    if (data.message.includes('მოგიწოვ')) is_pidarasti = true
                }

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
                    // sender info + vip
                    user_img: sender.img,
                    user_name: sender.name ?? null,
                    message_styles: sender.message_styles ?? null,
                    message_icon: sender.message_icon ?? null,
                    queen: sender.queen ?? null,
                    // actions
                    sticker: data.sticker ?? null,
                    jeirani: data.jeirani,
                    music: data.music ?? null,
                    music_accept: data.music_accept,
                    message: data.message
                })
                user.socket.send(message)
                if (is_pidarasti) {
                    const new_message = message
                    new_message.bot_danger = true
                    new_message.bot_success = false
                    new_message.center = true
                    new_message.message = 'გააჯვი ჩათიდან შე პიდარასტო !!!'
                    user.socket.send(new_message)
                }
            });
        } catch (error) {
            console.log(error)
        }

    }

    // music_actions ====================================> START
    async sharing_music_request(socket_id, accept) {
        try {
            let message = accept ? 'კარგი ჩავრთე' : 'არა მადლობა'
            this.send_messages({
                music: true,
                music_accept: accept,
                socket_id: socket_id,
                message: message
            })
        } catch (error) {
            console.log(error)
        }

    }

    async sharing_music(socket_id, music, index, collection) {
        try {
            const sender = this.#get_user_by_socket_id(socket_id)
            if (!sender) return
            const chat = this.#get_chat_by_id(sender.chat_id)
            if (!chat) return
            this.send_messages({
                music: true,
                socket_id: sender.socket_id,
                message: 'იქეთ მაგიდიდან სიმღერა მოგიძღვნეს'
            })
            chat.socket_ids.forEach(id => {
                const user = this.#get_user_by_socket_id(id)
                if (user.socket_id == sender.socket_id) return
                user.socket.send({
                    sharing_music: true,
                    music: music,
                    index: index,
                    collection: collection,
                    title: 'იქეთ მაგიდიდან სიმღერა მოგიძღვნეს'
                })
            });

        } catch (error) {
            console.log(error)
        }


    }

    async search_music(socket_id, query) {
        try {
            const musics = await Music_Service.search_music(query)
            const user = await this.#get_user_by_socket_id(socket_id)
            user.socket.send({
                search_music: true,
                musics: musics
            })
        } catch (error) {
            console.log(error)
        }

    }
    async get_music_collection(socket_id, name) {
        try {
            const music_collection = await Music_Service.get_music_collection(name)
            const user = await this.#get_user_by_socket_id(socket_id)
            user.socket.send({
                get_music_collection: true,
                music_collection
            })
        } catch (error) {
            console.log(error)
        }
    }

    #check_jeirani_started(socket_id) {
        try {
            let target_game = null
            this.#jeirani.forEach(game => {
                let players = game.players
                if (players.some(s => s.socket_id == socket_id)) {
                    target_game = game
                }
            });
            return target_game
        } catch (error) {
            console.log(error)
        }

    }

    #validate_game_jeirani(game) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    play_jeirani(socket_id, img_index) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    end_jeirani(socket_id) {
        try {
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
        } catch (error) {
            console.log(error)
        }

    }

    #remove_ended_jeirani_game(id) {
        try {
            this.#jeirani = this.#jeirani.filter(g => g.id != id)
        } catch (error) {
            console.log(error)
        }

    }

    #send_jeirani_results(results) {
        try {
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
        } catch (error) {
            console.log(error)
        }

    }

    send_users_count() {
        try {
            const users_count = this.#users.length
            let duble_count = 0
            let triple_count = 0
            let quadra_count = 0
            let penta_count = 0
            this.#chats.forEach(chat => {
                if (chat.users_count == 2) duble_count++
                if (chat.users_count == 3) triple_count++
                if (chat.users_count == 4) quadra_count++
                if (chat.users_count == 5) penta_count++
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
        } catch (error) {
            console.log(error)
        }

    }

    save_name(socket_id, name) {
        try {
            let user = this.#get_user_by_socket_id(socket_id)
            if (!user) return
            user.set_name(name)
            this.#update_user(user)
            return user
        } catch (error) {
            console.log(error)
        }

    }

    save_img(socket_id, src) {
        try {
            let user = this.#get_user_by_socket_id(socket_id)
            if (!user) return
            user.img = src
            this.#update_user(user)
            return user
        } catch (error) {
            console.log(error)
        }

    }

    #get_randon_int(max) {
        try {
            return Math.floor(Math.random() * max);
        } catch (error) {
            console.log(error)
        }
    }


}

const USERS_SERVICE = new Users_Service()
export default USERS_SERVICE


class User {
    #vip_profiles = [
        { queen: null, name: 'Sanzona', img: './static/vip_profiles/gungrave.png', message_icon: null, message_styles: 'color:#A51C30;box-shadow: -1px 0px 5px -2px rgba(210,18,46,0.75);-webkit-box-shadow: -1px 0px 5px -2px rgba(210,18,46,0.75);-moz-box-shadow: -1px 0px 5px -2px rgba(210,18,46,0.75);border-radius:0px !important;'},
        { queen: null, name: 'Jonah', img: './static/vip_profiles/Jonah.png', message_icon: null, message_styles: 'border-bottom: #A51C3096  solid 1px;border-top: #A51C3096  solid 1px;border-right: none;border-left: none;box-shadow: none;border-radius: 0px !important;'},
        { queen: null, name: 'Volk', img: './static/vip_profiles/Volk.png', message_icon: null, message_styles: 'border-right: #662d91b8   solid 1px;border-left: #662d91b8   solid 1px;border-top: none;border-bottom: none;box-shadow: none;border-radius: 0px !important;background-color:#662d911f;'},
        { queen: null, name: 'Lelouch', img: './static/vip_profiles/Lelouch.png', message_icon: './static/vip_profiles/icons/Geass.png', message_styles: 'border-right: #662d91b8 solid 3px;border-left: #662d91b8 solid 3px;border-top: #662d91b8 solid 1px;border-bottom: none;box-shadow: none;border-radius: 50px !important;background-color: #662d911f;color: #fddcdc;'},


        { queen: null,name: 'Bad girl', img: './static/vip_profiles/Bad_girl.png', message_icon: null, message_styles: 'border-right: #35374B solid 3px;border-left: #35374B solid 3px;border-top: none;border-bottom: none;box-shadow: none;border-radius: 25px !important;background-color: transparent;'},
        { queen: null, name: 'Hot', img: './static/vip_profiles/Hot.png', message_icon: null, message_styles: 'border-right: none;border-left: #940B92 solid 2px;border-top: none;border-bottom: none;box-shadow: none;border-radius: 0px 20px 0px 20px !important;background-color: #7a1cac1a;color: #ddcde6;'},
        { queen: true, name: 'Ana',img:'./static/vip_profiles/Queen.png', message_icon: './static/vip_profiles/icons/Tamaris_drosha.png', message_styles: 'border-right: #FFD7008A solid 2px;border-left: #FFD7008A solid 2px;border-top: #FFD7008A solid 1px;border-bottom: none;box-shadow: none;border-radius: 5px 5px 15px 15px !important;background-color: #ffef9617;color: #ffd9d9;'}
    ]
    user;
    chat_id;
    active;
    socket;
    socket_id;
    // profile
    message_styles;
    message_icon;
    queen;
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
    set_name(name) {
        const is_vip = this.#vip_profiles.find(v => v.name == name)
        if (is_vip) {
            this.name = name
            this.img = is_vip.img
            this.message_styles = is_vip.message_styles
            this.message_icon = is_vip.message_icon
            this.queen = is_vip.queen
        } else {
            this.name = name
        }
    }
    set_chat_id(id) {
        this.chat_id = id
    }
    set_is_active(bool) {
        this.active = bool
    }
}

class Message {

    // profile
    user_img;
    message_styles;
    message_icon;
    queen;
    // message data
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
    disconnect;
    connect;
    bot;
    right;
    center;
    message;
    date;
    constructor(data) {
        // profile
        this.user_img = data.user_img ?? './static/no_img.jpg'
        this.message_styles = data.message_styles ?? null
        this.message_icon = data.message_icon ?? null
        this.queen = data.queen ?? null
        // message data
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
        if (this.socket_ids.length == this.users_max_count) {
            this.is_full = true
        } else {
            this.is_full = false
        }
    }
    set_socket_ids(ids) {
        this.socket_ids = ids
        this.users_count = ids.length
        if (this.socket_ids.length == this.users_max_count) {
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

import { Music_Service } from "./music.js"


class Users_Service {

    constructor() {
        setInterval(() => {
            this.#connection_interval()
        }, 1000);
    }

    #users = []
    #doubles = []
    #triples = []
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
    //===== duble chats
    #get_duble_by_id(id) {
        const duble = this.#doubles.find(t => t.id == id)
        return duble
    }
    #set_duble(duble) {
        this.#doubles = [...this.#doubles, duble]
    }
    #delete_duble_by_id(id) {
        this.#doubles = this.#doubles.filter(d => d.id != id)
    }
    //===== trple chats
    #get_triple_by_id(id) {
        const triple = this.#triples.find(t => t.id == id)
        return triple
    }
    #set_triple(triple) {
        this.#triples = [...this.#triples, triple]
    }
    #delete_triple_by_id(id) {
        this.#triples = this.#triples.filter(d => d.id != id)
    }
    // =============================================================> STATE ACTIONS END


    // ======================================================================================> CREATE DUBLE CHAT START

    disconnect_user(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        if (sender.double_id) this.disconnect_duble(sender.socket_id)
        if (sender.triple_id) this.disconnect_triple(sender.socket_id)
        this.#delete_user(socket_id)
    }

    set_user_offline(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        if (sender.double_id) this.disconnect_duble(sender.socket_id)
        if (sender.triple_id) this.disconnect_triple(sender.socket_id)
    }


    #connection_interval() {
        const users_for_duble = this.#users.filter(u =>
            u.double_id == null
            && u.triple_id == null
            && u.active_for_duble == true
        )
        if (users_for_duble.length >= 2) {
            this.#connect_users_for_duble(
                users_for_duble[0],
                users_for_duble[1]
            )
        }
        const users_for_triple = this.#users.filter(u =>
            u.triple_id == null
            && u.active_for_triple == true
        )
        if (users_for_triple.length >= 3) {
            this.#connect_users_for_triple(
                users_for_triple[0],
                users_for_triple[1],
                users_for_triple[2]
            )
        }


    }



    #connect_users_for_triple(user_1, user_2, user_3) {
        const triple = new Triple({
            socket_ids: [user_1.socket_id, user_2.socket_id, user_3.socket_id]
        })
        if (user_1.double_id) this.#delete_duble_by_id(user_1.double_id)
        if (user_2.double_id) this.#delete_duble_by_id(user_2.double_id)
        if (user_3.double_id) this.#delete_duble_by_id(user_3.double_id)
        this.#set_triple(triple)
        // triole
        user_1.set_triple_id(triple.id)
        user_1.set_double_id(null)
        user_1.set_active_for_dule(false)
        user_1.set_active_for_triple(false)
        this.#update_user(user_1)

        user_2.set_triple_id(triple.id)
        user_2.set_double_id(null)
        user_2.set_active_for_dule(false)
        user_2.set_active_for_triple(false)
        this.#update_user(user_2)

        user_3.set_triple_id(triple.id)
        user_3.set_double_id(null)
        user_3.set_active_for_dule(false)
        user_3.set_active_for_triple(false)
        this.#update_user(user_3)
        this.send_messages({
            socket_id: user_1.socket_id,
            bot: true,
            connect: true,
            center: true,
            message: 'მესამე კაცი ნაპოვნია 😈 ვინ ვინ არის თქვენით არკვიეთ'
        })
        this.send_users_count()
    }

    async set_user_active_for_triple(socket_id, request, accept) {
        const user = this.#get_user_by_socket_id(socket_id)
        if (!user) return

        let request_accept = accept == true ? 'კარგი ფავიმატოთ' : accept == false ? 'არ მინდა' : ''
        let request_message = 'მოდი მესამე დავიმატოთ'
        this.send_messages({
            triple: true,
            triple_accept: request ? null : accept,
            socket_id: user.socket_id,
            bot: true,
            message: request ? request_message : request_accept
        })

        if (request == true || accept == true) {
            user.set_active_for_dule(false)
            user.set_active_for_triple(true)
            this.#update_user(user)
        }


    }

    set_user_online(socket_id) {
        let user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.set_double_id(null)
        user.set_triple_id(null)
        user.set_active_for_dule(true)
        user.set_active_for_triple(true)
        this.#update_user(user)
    }

    set_user_active_for_dubble(socket_id) {
        const user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.set_active_for_dule(true)
        user.set_active_for_triple(true)
        this.#update_user(user)
    }

    #connect_users_for_duble(user_1, user_2) {
        const duble = new Double({
            socket_ids: [user_1.socket_id, user_2.socket_id]
        })
        this.#set_duble(duble)
        user_1.set_double_id(duble.id)
        user_1.set_active_for_dule(false)
        user_1.set_active_for_triple(false)
        this.#update_user(user_1)
        user_2.set_double_id(duble.id)
        user_2.set_active_for_dule(false)
        user_2.set_active_for_triple(false)
        this.#update_user(user_2)
        this.send_messages({
            socket_id: user_1.socket_id,
            bot_success: true,
            connect: true,
            message: 'თანამოსაუბრე ნაპოვნია'
        })
        this.send_users_count()
    }

    disconnect_triple(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        const triple = this.#get_triple_by_id(sender.triple_id)
        if (!triple) return
        let other_soket_ids = []
        triple.socket_ids.forEach(socket_id => {
            if (socket_id != sender.socket_id) {
                other_soket_ids.push(socket_id)
            }
        })
        const dubble = new Double({
            socket_ids: other_soket_ids
        })
        this.#set_duble(dubble)

        other_soket_ids.forEach(socket_id => {
            const user = this.#get_user_by_socket_id(socket_id)
            if (!user) return
            user.set_active_for_dule(false)
            user.set_active_for_triple(false)
            user.set_double_id(dubble.id)
            user.set_triple_id(null)
            user.socket.send(
                new Message({
                    bot: true,
                    connect: true,
                    center: true,
                    message: 'ვიღაცა გავიდა 😈 ვინ დარჩა თქვენით არკვიეთ'
                })
            )
            this.#update_user(user)
        });
        sender.set_active_for_dule(false)
        sender.set_active_for_triple(false)
        sender.set_double_id(null)
        sender.set_triple_id(null)
        sender.socket.send(
            new Message({
                bot: true,
                disconnect: true,
                message: true
            })
        )
        this.#update_user(sender)
        if (triple) this.#delete_triple_by_id(triple.id)
        this.send_users_count()
    }

    disconnect_duble(socket_id) {
        const sender = this.#get_user_by_socket_id(socket_id)
        if (!sender) return
        const duble = this.#get_duble_by_id(sender.double_id)
        if (!duble) return
        duble.socket_ids.forEach(socket_id => {
            const user = this.#get_user_by_socket_id(socket_id)
            if (!user) return
            user.set_active_for_dule(false)
            user.set_active_for_triple(false)
            user.set_double_id(null)
            user.set_triple_id(null)
            user.socket.send(
                new Message({
                    bot: true,
                    disconnect: true,
                    message: true
                })
            )
            this.#update_user(user)
        });
        if (duble) this.#delete_duble_by_id(duble.id)
        this.send_users_count()
    }

    // ======================================================================================> CREATE DUBLE CHAT END












    send_sticker(socket_id, public_path) {
        this.send_messages({
            socket_id: socket_id,
            sticker: public_path,
            message: true
        })
    }

    send_messages(data) {
        const sender = this.#get_user_by_socket_id(data.socket_id)
        if (!sender) return
        let socket_ids = null
        const duble = this.#get_duble_by_id(sender.double_id)
        const triple = this.#get_triple_by_id(sender.triple_id)
        if (duble) socket_ids = duble.socket_ids
        if (triple) socket_ids = triple.socket_ids
        if (!socket_ids) return
        socket_ids.forEach(socket_id => {
            const user = this.#get_user_by_socket_id(socket_id)
            if (!user) return
            user.socket.send(
                new Message({
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


                    triple: data.triple ?? null,
                    triple_accept: data.triple_accept ?? null,
                    music: data.music ?? null,
                    music_accept: data.music_accept,

                    message: data.message
                })
            )
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
        let socket_ids = []
        const duble = this.#get_duble_by_id(sender.double_id)
        const triple = this.#get_triple_by_id(sender.triple_id)
        console.log()
        if (duble) socket_ids = duble.socket_ids
        if (triple) socket_ids = triple.socket_ids
        this.send_messages({
            music: true,
            socket_id: sender.socket_id,
            message: 'იქეთ მაგიდიდან სიმღერა მოგიძღვნეს'
        })
        socket_ids.forEach(id => {
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
    // music_actions ====================================> END




    async add_triple(socket_id, accept) {
        console.log('ad delete')
        const user_1 = await this.#get_user_by_socket_id(socket_id)
        if (!user_1.couple_socket_id) return
        const user_2 = await this.#get_user_by_socket_id(user_1.couple_socket_id)
        if (!user_1 || !user_2) return
        let message = accept ? 'კარგი დავიმატოთ' : 'არმინდა !'
        this.send_messages({
            bot_success: accept ? true : null,
            bot_danger: !accept ? true : null,
            triple: true,
            triple_accept: accept,
            socket_id: user_2.socket_id,
            message: message
        })

        console.log(accept)
        this.#find_triple_user(
            user_1.socket_id,
            user_2.socket_id
        )
    }

    #find_triple_user(user_1_socket_id, user_2_socket_id) {
        const find_interval = setInterval(() => {
            const user_1 = this.#get_user_by_socket_id(user_1_socket_id)
            const user_2 = this.#get_user_by_socket_id(user_2_socket_id)
            if (!user_1 || !user_2) {
                clearInterval(find_interval)
                return
            }
            if (user_1, user_2) {
                const user_3 = this.#get_triple_user(
                    user_1.socket_id,
                    user_2.socket_id
                )
                if (user_3) {
                    const triple = new Triple({
                        socket_ids: [user_1.socket_id, user_2.socket_id, user_3.socket_id]
                    })

                    user_1.set_triple_id(triple.id)
                    user_2.set_triple_id(triple.id)
                    user_3.set_triple_id(triple.id)

                    this.#update_user(user_1)
                    this.#update_user(user_2)
                    this.#update_user(user_3)
                    this.#set_triple(triple)
                    this.send_users_count()
                    this.send_messages({
                        triple_id: triple.id,
                        socket_id: user_1.socket_id,
                        message: 'ჩათში 3 კაცია ვინ ვინ არი თქვენით არკვიეთ 😈',
                        center: true,
                        connect: true
                    })
                    clearInterval(find_interval)
                    return
                }
            }
        }, 1000)
    }
    #get_triple_user(user_1_socket_id, user_2_socket_id) {
        const users = this.#users.filter(u => u.socket_id != user_1_socket_id
            && u.socket_id != user_2_socket_id
            && u.couple_socket_id == null
            && u.triple_socket_id == null
            && u.active == true
            && u.open_contact == true
            && u.triple_id == null
        )
        if (users.length == 0) {
            return null
        } else {
            return users[this.#get_randon_int(users.length)]
        }
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
            const dubble = this.#get_duble_by_id(sender.double_id)
            const triple = this.#get_triple_by_id(sender.triple_id)
            let socket_ids = []
            if (dubble) socket_ids = dubble.socket_ids
            if (triple) socket_ids = triple.socket_ids
            const jeireni = new Jeirani()
            socket_ids.forEach(socket_id => {
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
        console.log(results)
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

    send_message(socket_id, message, game_jeirani, game_jeirani_reject) {
        let user_1 = this.#get_user_by_socket_id(socket_id)
        if (!user_1) return
        let user_2 = this.#get_user_by_socket_id(user_1.couple_socket_id)
        if (!user_2) return

        user_1.socket.send(
            new Message({
                game_jeirani_reject: game_jeirani_reject,
                game_jeirani: game_jeirani,
                user_img: user_1.img,
                right: true,
                couple: { ...user_2, socket: null },
                message: message
            })
        )
        user_2.socket.send(
            new Message({
                game_jeirani_reject: game_jeirani_reject,
                game_jeirani: game_jeirani,
                user_img: user_1.img,
                right: false,
                couple: { ...user_1, socket: null },
                message: message
            })
        )
    }



    send_users_count() {
        for (let i = 0; i < this.#users.length; i++) {
            const socket = this.#users[i].socket
            socket.send({
                users_info: true,
                users_count: this.#users.length,
                couples_count: this.#doubles.length,
                triples_count: this.#triples.length
            })
        }
    }


    save_name(socket_id, name) {
        let user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.name = name
        this.#users = [...this.#users.filter(u => u.socket_id != socket_id), user]
        return user
    }


    save_img(socket_id, src) {
        let user = this.#get_user_by_socket_id(socket_id)
        if (!user) return
        user.img = src
        this.#users = [...this.#users.filter(u => u.socket_id != socket_id), user]
        return user
    }




    #get_randon_int(max) {
        return Math.floor(Math.random() * max);
    }


}

const USERS_SERVICE = new Users_Service()
export default USERS_SERVICE















class User {
    triple_id;
    active_for_triple;

    double_id;
    active_for_duble;

    open_contact;
    active;
    user_data;
    socket;
    socket_id;
    couple_socket_id;
    triple_socket_id;
    is_triple;
    name;
    img;
    constructor(socket) {
        this.double_id = null
        this.active_for_duble = false

        this.triple_id = null
        this.active_for_duble = false

        this.is_triple = null
        this.open_contact = false
        this.user_data = true
        this.socket = socket
        this.socket_id = socket.id
        this.couple_socket_id = null
        this.triple_socket_id = null
        this.name = null
        this.img = './static/no_img.jpg'
        this.active = false
    }
    set_triple_id(id) {
        this.triple_id = id
    }
    set_active_for_triple(is_active) {
        this.active_for_triple = is_active
    }

    set_active_for_dule(is_active) {
        this.active_for_duble = is_active
    }
    set_double_id(id) {
        this.double_id = id
    }



    set_couple_socket_id(id) {
        this.couple_socket_id = id
    }
    set_triple_socket_id(id) {
        this.triple_socket_id = id
    }
    set_is_triple(is_triple) {
        this.is_triple = is_triple
    }

    set_open_contact() {
        this.open_contact = true
    }
    set_close_contact() {
        this.open_contact = false
    }

    set_offline() {
        this.active = false
    }
    set_active(is_active) {
        this.active = is_active
    }
    set_online() {
        this.active = true
    }
}

class Message {
    bot_success
    bot_danger
    border;
    triple;
    triple_accept
    music;
    music_accept;
    sticker;
    jeirani;
    user_img;
    disconnect;
    connect;
    bot;
    right;
    center;
    couple;
    triple;
    message;
    date;
    constructor(data) {
        this.bot_danger = data.bot_danger ?? null
        this.bot_success = data.bot_success ?? null
        this.jeirani = data.jeirani ?? null

        this.triple = data.triple ?? null
        this.triple_accept = data.triple_accept ?? null
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
        this.couple = data.couple ?? null
        this.triple = data.triple
        this.date = this.#get_time()
    }

    #get_time() {
        let date = new Date(Date.now());
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return hours + ':' + minutes
    }
}

class Double {
    id;
    socket_ids = []
    constructor(data) {
        this.id = Date.now()
        this.socket_ids = data.socket_ids
    }
}

class Triple {
    id;
    socket_ids = []
    constructor(data) {
        this.id = Date.now()
        this.socket_ids = data.socket_ids
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



import USERS_SERVICE from '../services/users.js';




class Users_Controller {



    #chat_actions = []
    #warning_ip = []
    #blocked_ip = []

    constructor() {
        setInterval( ()=> {
            this.#chat_actions = []
            this.#warning_ip = []
            console.log('clear')
        }, 10000 )
    }

    get_yle_ips() {
        return this.#blocked_ip
    }

    set_ip(ip) {
        this.#chat_actions.push(ip)
    }

    is_blocked(ip) {
        const user = this.#blocked_ip.find(  i => i == ip )
        if(user) {
            return true
        } else return false
    }

    spam_check(ip) {
        const user_actions = this.#chat_actions.filter(  i => i == ip )
        if(user_actions.length > 7) {
            this.#warning_ip.push(ip)

            const warnings = this.#warning_ip.filter(  i => i == ip )
            if(warnings.length > 3) {
                this.#blocked_ip.push(ip)
            }
            return true
        } else {
            return false
        }
    }


    validate(socket) {
        const ip = socket.handshake.address
        
        this.find_or_create(socket)
        USERS_SERVICE.send_rooms()
        USERS_SERVICE.send_users_count()
        

        socket.on('disconnect', () => {
            USERS_SERVICE.disconnect_user(socket.id)
            USERS_SERVICE.send_users_count()
            USERS_SERVICE.send_rooms()
            USERS_SERVICE.end_jeirani(socket.id)
        })

        socket.on('getting', (data) => {
            
            if (data.message) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                USERS_SERVICE.send_messages({socket_id: socket.id, message: data.message})
            } 
            if (data.sticker) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                USERS_SERVICE.send_sticker(socket.id, data.public_path)
            } 




            if (data.offline) USERS_SERVICE.set_user_offline(socket.id)
            if (data.online) USERS_SERVICE.set_user_online(socket.id)

            if(data.room) {
                USERS_SERVICE.connect_user_to_room(socket.id, data.room_id)
            }

            if (data.open_chat_request) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                let socket_id = socket.id
                let max_users = data.max_users
                USERS_SERVICE.open_chat_request(socket_id, max_users)
            }
            
            if (data.open_chat_accept) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                let socket_id = socket.id
                let max_users = data.max_users
                USERS_SERVICE.open_chat_accept(socket_id, max_users)
            }

            if (data.open_chat_decline) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                let socket_id = socket.id
                USERS_SERVICE.open_chat_decline(socket_id)
            }

            // profile_actions
            if (data.change_name) this.change_user_name(socket, data.name)
            if (data.change_img) this.change_user_img(socket, data.img)


            // game_actions
            if (data.jeirani) USERS_SERVICE.play_jeirani(socket.id, data.img_index)
            if (data.end_jeirani) USERS_SERVICE.end_jeirani(socket.id)
            // music_actions
            if (data.get_music_collection)  USERS_SERVICE.get_music_collection(socket.id, data.name)
            if (data.search_music)  USERS_SERVICE.search_music(socket.id, data.query)
            if (data.sharing_music) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                USERS_SERVICE.sharing_music(socket.id, data.music, data.index, data.collection) 
            }
            if (data.sharing_music_request) {
                this.set_ip(ip)
                if(this.spam_check(ip)) return
                if(this.is_blocked(ip)) return
                USERS_SERVICE.sharing_music_request(socket.id, data.accept)
            } 
            // triple

        })
    }




    change_user_name(socket, name) {
        const user = USERS_SERVICE.save_name(socket.id, name)
        socket.send({
            change_name: true,
            name: user.name
        })
    }
    change_user_img(socket, src) {
        const user = USERS_SERVICE.save_img(socket.id, src)
        socket.send({
            change_img: true,
            img: user.img
        })
    }


    find_or_create(socket) {
        const user = USERS_SERVICE.find_or_create(socket)
        const public_data = { ...user, socket: null }
        socket.send(public_data)
        return user
    }

}

const USERS_CONTROLLER = new Users_Controller()
export default USERS_CONTROLLER



import USERS_SERVICE from '../services/users.js';




class Users_Controller {

    validate(socket) {
        this.find_or_create(socket)
        this.send_users_count()
      
        socket.on('disconnect', () => {
            USERS_SERVICE.disconnect_user(socket.id)
            USERS_SERVICE.send_users_count()
            USERS_SERVICE.end_jeirani(socket.id)
        })

        socket.on('getting', (data) => {
            if (data.offline) USERS_SERVICE.set_user_offline(socket.id)
            if (data.online) USERS_SERVICE.set_user_online(socket.id) 
            if (data.find_triple) {
                let socket_id = socket.id
                let request = data.request
                let accept = data.accept
                USERS_SERVICE.set_user_active_for_triple(socket_id, request, accept)
            }  
              
            

            // profile_actions
            if (data.change_name) this.change_user_name(socket, data.name)
            if (data.change_img) this.change_user_img(socket, data.img)
                

            if (data.message) this.send_message(socket.id, data.message)
            if (data.sticker) this.send_sticker(socket.id, data.public_path)
            // game_actions

            if (data.jeirani)  USERS_SERVICE.play_jeirani(socket.id, data.img_index)
            if (data.end_jeirani)  USERS_SERVICE.end_jeirani(socket.id)
            // music_actions
            if (data.get_music_collection) this.get_music_collection(socket.id, data.name)
            if (data.search_music) this.search_music(socket.id, data.query)
            if (data.sharing_music) this.sharing_music(socket.id, data.music, data.index, data.collection)
            if (data.sharing_music_request) this.sharing_music_request(socket.id, data.accept)
            // triple
       
            if (data.add_triple_request == true || data.add_triple_request == false) {
                console.log('add')
                USERS_SERVICE.add_triple(socket.id, data.add_triple_request)
            } 
        })
    }
    // music_actions
    sharing_music_request(socket_id, accept) {
        USERS_SERVICE.sharing_music_request(socket_id, accept)
    }
    sharing_music(socket_id, music, index, collection) {
        USERS_SERVICE.sharing_music(socket_id, music, index, collection)
    }
    search_music(socket_id, query) {
        USERS_SERVICE.search_music(socket_id, query)
    }
    get_music_collection(socket_id, name) {
        USERS_SERVICE.get_music_collection(socket_id, name)
    }



    // args [socket, message, play_jeirani]
    send_message(socket_id, message) {
        if(message.length != 0) { 
            USERS_SERVICE.send_messages({
                socket_id, 
                message: message
            })
        } 
    }
    send_sticker(socket_id, public_path) {
        USERS_SERVICE.send_sticker(socket_id, public_path)
    }
    
    change_couple(user) {
        if(user.couple_socket_id) {
            USERS_SERVICE.disconnect_couple(user)
        }
    }

    find_couple(socket_id) {
        USERS_SERVICE.find_couple(socket_id) 
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

    send_users_count() {
        USERS_SERVICE.send_users_count()
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






class app_controller {

    // B=button , C=container || box E=text || number element

    #message_box = document.getElementById('message_box')

    #text_area = document.getElementById('text_area')
    #send_btn = document.getElementById('send_btn')

    //Profile
    #profile_img = document.getElementById('profile_img')
    #send_name_btn = document.getElementById('send_name_btn')
    #edit_name_btn = document.getElementById('edit_name_btn')
    #name_inp = document.getElementById('name_inp')
    //App
    #find_couple_btn = document.getElementById('find_couple_btn')
    #disconnect_couple_btn = document.getElementById('disconnect_couple_btn')
    #next_couple_btn = document.getElementById('next_couple_btn')
    // app ganes
    #toggle_game_modal_btn = document.getElementById('toggle_game_modal_btn')
    #close_game_modal_btn = document.getElementById('close_game_modal_btn')
    #end_jeirani_game_btn = document.getElementById('end_jeirani_game_btn')
    // app sticters
    #sticker_bar_toggle_btn = document.getElementById('sticker_bar_toggle_btn')

    // block
    #connect_block = document.getElementById('connect_block')
    #loading_block = document.getElementById('loading_block')
    #disconnect_block = document.getElementById('disconnect_block')
    #rooms_block = document.getElementById('rooms_block')

    // app music
    #music_collections_list = document.getElementById('music_collections_list')
    #music_collection_list = document.getElementById('music_collection_list')
    #music_search_list = document.getElementById('music_search_list')
    #bach_to_music_collections_btn = document.getElementById('bach_to_music_collections_btn')
    #music_collection_name = document.getElementById('music_collection_name')

    #music_modal_player = document.getElementById('music_modal_player')
    #music_modal_player_box = document.getElementById('music_modal_player_box')
    // app music state !! ==============>
    #current_music_index = null
    #current_music = null
    #music_collection = null
    #current_music_id_path = null

    #sharing_music_index = null
    #sharing_music_music = null
    #sharing_music_collection = null

    #replay_message_id = null
    #replay_message_text = null

    // app music state !! ==============>

    #play_next_music_btn = document.getElementById('play_next_music_btn')
    #play_previous_music_btn = document.getElementById('play_previous_music_btn')
    #mix_music_btn = document.getElementById('mix_music_btn')
    #cansel_music_player_btn = document.getElementById('cansel_music_player_btn')
    #sharing_music_btn = document.getElementById('sharing_music_btn')
    #close_player_modal_btn = document.getElementById('close_player_modal_btn')
    #player_modal_toggle_btn = document.getElementById('player_modal_toggle_btn')

    #music_search_input = document.getElementById('music_search_input')
    #player_current_music_index = document.getElementById('player_current_music_index')
    #player_total_music_index = document.getElementById('player_total_music_index')
    // message replay
    #cansel_message_replay_B = document.getElementById('cansel_message_replay_B')
    #message_replay_E = document.getElementById('message_replay_E')
    #message_replay_C = document.getElementById('message_replay_C')




    constructor() {
        // profile
        this.#edit_name_btn.addEventListener('click', () => this.#edit_name())
        this.#send_name_btn.addEventListener('click', () => this.#send_name())
        // app
        this.#send_btn.addEventListener('click', () => this.send_message())
        this.#find_couple_btn.addEventListener('click', () => this.#find_couple())
        this.#next_couple_btn.addEventListener('click', () => this.#find_couple())
        this.#disconnect_couple_btn.addEventListener('click', () => this.disconnect())


        this.#text_area.addEventListener('keyup', (e)=> {
            if(e.keyCode == 13) this.send_message()
        })


        // app games
        this.#end_jeirani_game_btn.addEventListener('click', () => this.#end_jeirani_game())

        // app music
        this.#bach_to_music_collections_btn.addEventListener('click', () => this.#back_to_music_collections())
        this.#play_next_music_btn.addEventListener('click', () => this.#play_next_music())
        this.#play_previous_music_btn.addEventListener('click', () => this.#play_previous_music())
        this.#mix_music_btn.addEventListener('click', () => this.#play_mix_music())
        this.#cansel_music_player_btn.addEventListener('click', () => this.#cansel_music_player())
        this.#music_search_input.addEventListener('change', () => this.#search_music())
        this.#sharing_music_btn.addEventListener('click', () => this.#sharing_music())
        // message replay
        this.#cansel_message_replay_B.addEventListener('click', () => this.#cansel_message_replay())

    }

    // app info ===================


    set_users_count(data) {
        //header-partails
        document.getElementById('users_count').textContent = data.users_count
        document.getElementById('duble_count').textContent = data.duble_count
        const duble_count_C = document.getElementById('duble_count_C')
        duble_count_C.style.display = data.duble_count ? 'block' : 'none'
        document.getElementById('triple_count').textContent = data.triple_count
        const triple_count_C = document.getElementById('triple_count_C')
        triple_count_C.style.display = data.triple_count ? 'block' : 'none'
        document.getElementById('quadra_count').textContent = data.quadra_count
        const quadra_count_C = document.getElementById('quadra_count_C')
        quadra_count_C.style.display = data.quadra_count ? 'block' : 'none'
        document.getElementById('penta_count').textContent = data.penta_count
        const penta_count_C = document.getElementById('penta_count_C')
        penta_count_C.style.display = data.penta_count ? 'block' : 'none'
    }


    // rooms ================= START

    set_rooms_info(rooms) {
        rooms.forEach(room => {
            const count_E = document.getElementById(`count_${room.id}`)
            if(!count_E) return
            count_E.textContent = `${room.users_count}/${room.users_max_count}`
        });
    }

    connect_to_room(room_id) {
        Api_Controller.outgoing_data({
            room: true,
            room_id: room_id,
        })
    }
    // rooms ================= END

    // onen chat ================= START
    open_chat_request(max_users) {
        Api_Controller.outgoing_data({
            open_chat_request: true,
            max_users: max_users,
        })
    }
    open_chat_accept(max_users, message_id) {
        const message = document.getElementById(message_id)
        if (message) message.remove()
        Api_Controller.outgoing_data({
            open_chat_accept: true,
            max_users: max_users,
        })
    }
    open_chat_decline(message_id) {
        const message = document.getElementById(message_id)
        if (message) message.remove()
        Api_Controller.outgoing_data({
            open_chat_decline: true,
        })
    }




    // app music ================= START
    #sharing_music() {
        const music = this.#current_music
        if (!music) return
        const collection = this.#music_collection
        Api_Controller.outgoing_data({
            sharing_music: true,
            index: this.#current_music_index,
            music: music,
            collection: collection
        })
    }
    async accept_sharing_music(message_id) {
        const message = document.getElementById(message_id)
        if (message) message.remove()

        this.#sharing_music_music
        if (!this.#sharing_music) return
        if (this.#sharing_music_collection) {
            this.set_music_collection(this.#sharing_music_collection)
        } else {
            this.set_search_music([this.#sharing_music_music])
        }
        this.#close_player_modal_btn.click()
        setTimeout(() => {
            this.#player_modal_toggle_btn.click()
            this.play_music(this.#sharing_music_music, this.#sharing_music_index)
            Api_Controller.outgoing_data({
                sharing_music_request: true,
                accept: true
            })
        }, 500)

    }

    decline_sharing_music(message_id) {
        const message = document.getElementById(message_id)
        if (message) message.remove()
        this.#sharing_music_index = null
        this.#sharing_music_music = null
        this.#sharing_music_collection = null
        Api_Controller.outgoing_data({
            sharing_music_request: true,
            accept: false
        })
    }


    set_sharing_music_request(music, index, collection) {
        this.#sharing_music_index = index
        this.#sharing_music_music = music
        this.#sharing_music_collection = collection
    }

    #search_music() {
        const query = this.#music_search_input.value
        if (query.length == 0) return
        Api_Controller.outgoing_data({
            search_music: true,
            query: query
        })
    }

    set_search_music(musics) {
        this.#music_collection_name.textContent = ''
        this.#music_collection = null
        this.#current_music_index = null
        this.#music_search_list.innerHTML = ''
        this.#music_collection_list.innerHTML = ''
        this.#music_collection_list.style.display = 'none'
        this.#music_collections_list.style.display = 'none'
        musics.forEach(music => {
            const item = this.#get_music_item(music)
            this.#music_search_list.appendChild(item)
        });
        if (musics.length == 0) {

        }

    }

    #back_to_music_collections() {
        this.#music_search_input.value = ''
        this.#music_search_list.innerHTML = ''
        this.#music_collection_list.innerHTML = ''
        this.#music_collection_name.textContent = ''
        this.#music_collection_list.style.display = 'none'
        this.#music_collections_list.style.display = 'block'
    }

    #cansel_music_player() {
        this.#current_music = null
        this.#current_music_index = null
        this.#music_modal_player_box.style.display = 'none'
        this.#music_modal_player.src = ''
    }

    #play_mix_music() {
        if (!this.#music_collection) return
        let index = this.#get_randon_int(this.#music_collection.collection.length)
        let music = this.#music_collection.collection[index]
        if (music) this.play_music(music, index)
    }

    #get_randon_int(max) {
        return Math.floor(Math.random() * max);
    }

    #play_next_music() {
        if (this.#current_music_index == null) return
        let next = this.#music_collection.collection[(this.#current_music_index + 1)]
        if (next) this.play_music(next, (this.#current_music_index + 1))
    }

    #play_previous_music() {
        if (this.#current_music_index == null) return
        let previous = this.#music_collection.collection[(this.#current_music_index - 1)]
        if (previous) this.play_music(previous, (this.#current_music_index - 1))
    }

    play_music(music, index) {
        this.#current_music = music
        this.#current_music_index = index
        this.#music_modal_player_box.style.display = 'block'
        this.#music_modal_player.src = music.mp3_public_path
        if (this.#music_collection) {
            this.#player_current_music_index.textContent = (index + 1)
            this.#player_total_music_index.textContent = this.#music_collection.collection.length
        } else {
            this.#player_current_music_index.textContent = ''
            this.#player_total_music_index.textContent = ''
        }


        this.#music_modal_player.play()

        if (this.#current_music_id_path) {
            const last_card_played = document.getElementById(this.#current_music_id_path)
            if (last_card_played) {
                last_card_played.style.display = 'none'
                const last_card_player_music_name = document.getElementById(`${this.#current_music_id_path}_name`)
                last_card_player_music_name.style.display = 'block'
            }
        }
        const card_played = document.getElementById(music.mp3_public_path)
        card_played.style.display = 'block'
        this.#current_music_id_path = music.mp3_public_path
    }







    set_music_collection(music_collection) {
        this.#music_search_input.value = ''
        this.#music_search_list.innerHTML = ''
        this.#music_collection = music_collection
        music_collection.collection.forEach((music, index) => {
            const item = this.#get_music_item(music, index)
            this.#music_collection_list.append(item)
        });
        this.#music_collection_list.style.display = 'block'
        this.#music_collections_list.style.display = 'none'
        this.#music_collection_name.textContent = music_collection.name
    }

    #get_music_item(music, index) {
        const item = document.createElement('div')
        item.onclick = () => App_Controller.play_music(music, index)
        item.innerHTML = `
            <div class="card p-0 mb-1 w-100  music_collection_card text-light-emphasis shadow_blue">
                <div class="row m-0 p-0">
                    <div class="col-2 m-0 p-0 played_music" id='${music.mp3_public_path}_img'>
                        <img src="${music.poster_public_path}" class="img-fluid rounded-start music_card_img" alt="...">
                    </div>
                    <div class="col-10 m-0 p-0  d-flex align-items-center justify-content-center text-center">
                        <small id='${music.mp3_public_path}_name' class="p-1">${music.name}</small>
                        <span 
                            id="${music.mp3_public_path}" 
                            class="position-absolute top-0 start-100 translate-middle" 
                            style="display:none"
                        >
                            <i class="bi bi-play-circle-fill text-primary fs-6"></i>
                        </span>
                    </div>
                </div>
            </div>
        `
        return item
    }

    get_music_collection(name) {
        Api_Controller.outgoing_data({
            get_music_collection: true,
            name: name
        })
    }



    // app music ================= END

    // app games ================= START
    close_games_modal() {
        this.#close_game_modal_btn.click()
    }

    play_jeirani(img_index) {
        this.#close_game_modal_btn.click()
        Api_Controller.outgoing_data({
            jeirani: true,
            img_index: img_index
        })
    }
    #end_jeirani_game() {
        Api_Controller.outgoing_data({
            end_jeirani: true,
        })
    }
    show_jeirani_request() {
        setTimeout(() => {
            this.#toggle_game_modal_btn.click()
        }, 500)
    }
    send_jeirani_game_results(data) {
        this.close_games_modal()
        const message = data.message
        const win = data.win
        const item = document.createElement('div')
        item.className = 'text-center'
        item.innerHTML = `
            <div class="text-center ${win == true ? 'text-success-emphasis' : win == false ? 'text-danger-emphasis' : 'text-primary-emphasis'}">
                <div class="d-flex align-items-center justify-content-center">
                    ${data.item_images[0] ? `<img src="${data.item_images[0]}" class="jeirani-result-img img-fluid rounded-circle border-2 border border-light-subtle m-1">` : ''}
                    ${data.item_images[1] ? `<img src="${data.item_images[1]}" class="jeirani-result-img img-fluid rounded-circle border-2 border border-light-subtle m-1">` : ''}
                    ${data.item_images[2] ? `<img src="${data.item_images[2]}" class="jeirani-result-img img-fluid rounded-circle border-2 border border-light-subtle m-1">` : ''}
                    ${data.item_images[3] ? `<img src="${data.item_images[3]}" class="jeirani-result-img img-fluid rounded-circle border-2 border border-light-subtle m-1">` : ''}
                    ${data.item_images[4] ? `<img src="${data.item_images[4]}" class="jeirani-result-img img-fluid rounded-circle border-2 border border-light-subtle m-1">` : ''}
                </div>
                <h5 class="game_text">${message}</h5>
            </div>
        `
        this.#message_box.appendChild(item)
        this.scrool_bottom()
    }


    // app games ================= END

    // app stickers ================= START

    // app stickers ================= END
    send_sticker(public_path) {
        Api_Controller.outgoing_data({
            sticker: true,
            public_path
        })
        this.#sticker_bar_toggle_btn.click()
    }
    // app actions ================= START
    add_message_replay(id) {
        const message = document.getElementById(id)
        if(!message) return
        let message_text = message.textContent.trim()
        this.#replay_message_id = id
        this.#replay_message_text = message_text
        this.#message_replay_E.textContent = this.#cut_text(message_text)
        this.#message_replay_C.style.display = 'block'
    }

    #cansel_message_replay() {
        this.#replay_message_id = null
        this.#replay_message_text = null
        this.#message_replay_E.textContent = ''
        this.#message_replay_C.style.display = 'none'
    }

    #cut_text(text) {
        if(text.length > 37) {
            return text.slice(0, 37) + '...' 
        } else return text
    }

    send_message() {
        const text_area = document.getElementById('text_area')
        const message = text_area.value
        text_area.value = ''
        if (message.length < 2) return
        Api_Controller.outgoing_data({
            message: message,
            message_replay_id: this.#replay_message_id,
            message_replay_text: this.#replay_message_text ,
        })
        this.#cansel_message_replay()
    }

    start(user) {
        this.#connect_block.style.display = "block"
        this.#rooms_block.style.display = "block"
    }

    #find_couple() {
        this.#connect_block.style.display = 'none'
        this.#disconnect_block.style.display = 'none'
        this.#rooms_block.style.display = "none"
        this.#loading_block.style.display = 'block'
        Api_Controller.outgoing_data({
            online: true
        })
    }
    connect() {
        this.#toggle_game_modal_btn.disabled = false
        this.#text_area.disabled = false
        this.#send_btn.disabled = false
        this.#message_box.style.display = 'block'
        // blocks
        this.#connect_block.style.display = 'none'
        this.#rooms_block.style.display = "none"
        this.#disconnect_block.style.display = 'none'
        this.#loading_block.style.display = 'none'

    }
    disconnect() {
        Api_Controller.outgoing_data({
            offline: true
        })
        this.#toggle_game_modal_btn.disabled = true
        this.#text_area.disabled = true
        this.#send_btn.disabled = true
        this.#text_area.value = ''
        this.#message_box.style.display = 'none'
        this.#message_box.innerHTML = ''
        // blocks
        this.#connect_block.style.display = 'none'
        this.#rooms_block.style.display = "block"
        this.#disconnect_block.style.display = 'block'
        this.#loading_block.style.display = 'none'

    }

    // app actions ================= END

    // profile actions ================= START
    #send_name() {
        const name = name_inp.value
        Api_Controller.outgoing_data({
            change_name: true,
            name: name
        })
    }
    #edit_name() {
        this.#name_inp.value = ''
        this.#name_inp.disabled = false
        this.#send_name_btn.disabled = false
    }
    set_name(name) {
        this.#name_inp.value = name
        this.#name_inp.disabled = true
        this.#send_name_btn.disabled = true
    }
    send_img(img) {
        Api_Controller.outgoing_data({
            change_img: true,
            img: img
        })
    }
    set_img(img) {
        this.#profile_img.src = img
    }
    // profile actions ================= END


    scrool_bottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth' // Optional: Add smooth scrolling effect
        });
    }

    // user chat


    set_message_center(data) {
        const message = data.message
        const bot_danger = data.bot_danger
        const bot_success = data.bot_success

        const item = document.createElement('div')
        item.className = 'text-center w-100  d-flex align-items-center justify-content-center'
        item.innerHTML = `
            <div class="alert alert-dark shadow_blue d-flex align-items-center justify-content-center message-center p-2 rounded-1 m-3" role="alert">
                ${bot_success ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${bot_danger ? `<i class="bi bi-robot m-1 text-danger"></i>` : ''}
                ${message}
            </div>
        `
        this.#message_box.appendChild(item)
        this.scrool_bottom()
    }

    set_message_right(data) {
        const id = data.id
        const message_replay_id = data.message_replay_id
        const message_replay_text = data.message_replay_text
        // user profile + vip
        const img = data.user_img
        const name = data.user_name
        const message_styles = data.message_styles
        const image_styles = data.image_styles
        debugger
        const message_icon = data.message_icon
        // message data
        this.#text_area.value = ''
        const bot_danger = data.bot_danger
        const bot_success = data.bot_success
        const music = data.music
        const music_accept = data.music_accept
        const sticker = data.sticker
        const disconnect = data.disconnect
        const connect = data.connect
        const message = data.message
        const item = document.createElement('div')
        item.id = id
        item.className = 'd-flex align-items-center justify-content-end m-1 mb-2 '
        item.innerHTML = `
            <div 
                class=" ${sticker ? '' : 'alert alert-dark shadow_blue'} d-flex align-items-center justify-content-end  p-2 rounded-1 m-2 mt-0 mb-0" 
                style='${sticker ? '' : message_styles}'
                role="alert"
            >
                ${message_icon ? `
                    <span class="position-absolute top-0 start-50 translate-middle">
                        <img  src='${message_icon}' class="message_icon ">
                    </span>  
                ` : ''}
             

                ${connect ? `
                    <span id="couple_name" class="m-2 mt-0 mb-0">
                        ${name ? name :
                    `<p class="placeholder-glow">
                        <span class="placeholder placeholder-sm" style="width: 50px;"></span>
                    </p>`
                }  
                    </span> ` : ''}
                ${disconnect ? `
                    <button class="btn-grad-black btn-grad-black-liner me-2" onclick="find_couple()">
                        ძიება
                        <i class="bi bi-search-heart-fill"></i>
                    </button>
                ` : ''}
                ${sticker ? `
                    <span class="text-start">
                        <img src="${sticker}" class="chat-sticker img-fluid"/>
                    </span>
                    ` : ''}
                ${!sticker && message ? `<span class="text-start">
                    ${message_replay_text ? `<div class="text-start bg-secondary-subtle text-secondary p-1 px-2 rounded-1 border-0 border-secondary-subtle">
                        <a href="#${message_replay_id}" class='redirect_message'>
                            <small class='text-secondary'>
                                ${message_replay_text}
                            </small>
                            <i class="bi bi-link-45deg text-secondary"></i>
                        </a>
                    </div>` : ''}
                    ${message}
                </span>` : ''}
     
                ${bot_success ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${bot_danger ? `<i class="bi bi-robot m-1 text-danger"></i>` : ''}

                ${music && music_accept == null ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${music && music_accept == true ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${music && music_accept == false ? `<i class="bi bi-robot m-1 text-danger"></i>` : ''}
            </div>
            <div class="text-center m-1 mt-0 mb-0">
                <img 
                    style="${image_styles ?? ''}"
                    src="${img}" 
                    class="float-start message_img ${image_styles ? '' : 'rounded-circle'}" 
                    alt="..."
                >
            </div>
        `
        this.#message_box.appendChild(item)
        this.scrool_bottom()
    }

    set_message_left(data) {
        const id = data.id ?? 0
        const message_replay_id = data.message_replay_id
        const message_replay_text = data.message_replay_text
        // user profile + vip
        const img = data.user_img
        const name = data.user_name
        const message_styles = data.message_styles
        const image_styles = data.image_styles
        debugger
        const message_icon = data.message_icon
        // message data
        const bot_danger = data.bot_danger
        const bot_success = data.bot_success
        const open_chat_request = data.open_chat_request
        const max_users = data.max_users
        const music = data.music
        const music_accept = data.music_accept
        const sticker = data.sticker
        const connect = data.connect
        const message = data.message
        const item = document.createElement('div')
        item.id = id
        item.className = 'd-flex align-items-center justify-content-start m-1 mb-2'
        item.innerHTML = `
            <div class="text-center m-1 mt-0 mb-0">
                <img
                    style="${image_styles ?? ''}"
                    src="${img}" 
                    class="float-start message_img ${image_styles ? '' : 'rounded-circle'}" 
                    alt="..."
                >
            </div>
           
            <div 
                class="${sticker ? '' :  'alert alert-dark shadow_blue'} d-flex align-items-center justify-content-start  p-2 rounded-1 m-2 mt-0 mb-0"
                style='${sticker ? '' : message_styles}'
                role="alert" 
            >
                 ${message_icon ? `
                    <span class="position-absolute top-0 start-50 translate-middle">
                        <img  src='${message_icon}' class="message_icon runded-1">
                    </span>  
                ` : ''}
                ${bot_success ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${bot_danger ? `<i class="bi bi-robot m-1 text-danger"></i>` : ''}
          
                ${music && music_accept == null ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${music && music_accept == true ? `<i class="bi bi-robot m-1 text-success"></i>` : ''}
                ${music && music_accept == false ? `<i class="bi bi-robot m-1 text-danger"></i>` : ''}

                ${sticker ? `
                    <span class="text-end">
                        <img src="${sticker}" class="chat-sticker img-fluid" />
                    </span>
                    ` : ''}
                ${!sticker && message ? `<span class="text-start">
                     ${message_replay_text ? `<div class="text-start bg-secondary-subtle text-secondary p-1 px-2 rounded-1 border-0 border-secondary-subtle">
                        <a href="#${message_replay_id}" class='redirect_message'>
                            <small class='text-secondary'>
                                ${message_replay_text}
                            </small>
                            <i class="bi bi-link-45deg text-secondary"></i>
                        </a>
                     </div>` : ''}
                    ${message}
                </span>` : ''}
                
                ${music && music_accept === null ? `
                    <button type="button" class="btn-grad-black btn-grad-black-liner mx-1" onclick="App_Controller.accept_sharing_music(${id})">
                        <i class="bi bi-play-circle"></i>
                    </button>
                    <button type="button" class="btn-grad-black btn-grad-black-liner mx-1" onclick="App_Controller.decline_sharing_music(${id})">
                        <i class="bi bi-x-octagon"></i>
                    </button>       
                ` : ''}
                ${open_chat_request ? `
                    <button type="button" class="btn-grad-black btn-grad-black-liner mx-1" onclick="App_Controller.open_chat_accept(${max_users}, ${id})">
                        <i class="bi bi-plus-circle"></i>
                    </button>
                    <button type="button" class="btn-grad-black btn-grad-black-liner mx-1" onclick="App_Controller.open_chat_decline(${id})">
                        <i class="bi bi-x-octagon"></i>
                    </button>       
                ` : ''}
                ${connect ? `
                    <span id="couple_name" class="m-2 mt-0 mb-0">
                        ${name ? name :
                    `<p class="placeholder-glow">
                        <span class="placeholder placeholder-sm" style="width: 50px;"></span>
                    </p>`
                }  
                </span> ` : ''}
            </div>
            </div>
            ${!sticker && message && !message_replay_text ? `<i class="bi bi-reply-all-fill text-secondary" style="cursor: pointer;" onclick="App_Controller.add_message_replay(${id})"></i>` : ''}
            
        `


        this.#message_box.appendChild(item)
        this.scrool_bottom()
    }

}

const App_Controller = new app_controller()



class api_controller {

    #connect = false

    incoming_data(soket) {
        soket.on('message', (data) => {
            if(data.rooms_info) App_Controller.set_rooms_info(data.rooms)
            if (data.user) App_Controller.start(data)
            if (data.jeirani == false) {
                App_Controller.close_games_modal()
            }
            if (data.change_name) App_Controller.set_name(data.name)
            if (data.change_img) App_Controller.set_img(data.img)
            if (data.users_info) App_Controller.set_users_count(data)
            if (data.jeirani_result) {
                App_Controller.send_jeirani_game_results(data)
            }
            if (data.message && !data.jeirani_result) {
                if (data.connect) App_Controller.connect()
                if (data.disconnect) App_Controller.disconnect()
                if (!data.disconnect) {
                    if (data.jeirani) {
                        App_Controller.close_games_modal()
                        if (!data.right) {
                            App_Controller.show_jeirani_request()
                        }
                    }
                    if (data.center) {
                        App_Controller.set_message_center(data)
                    } else {
                        if (data.right) App_Controller.set_message_right(data)
                        if (!data.right) App_Controller.set_message_left(data)
                    }

                }

            }
            if (data.disconnect) this.#connect = false
            // music_actions
            if (data.get_music_collection) App_Controller.set_music_collection(data.music_collection)
            if (data.search_music) App_Controller.set_search_music(data.musics)
            if (data.sharing_music) App_Controller.set_sharing_music_request(data.music, data.index, data.collection, data.title)
        })



    }

    outgoing_data(data) {
        SOCKET.emit('getting', data)
    }

}

const Api_Controller = new api_controller()
Api_Controller.incoming_data(SOCKET)




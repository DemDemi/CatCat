import SPAM_SERVICE from '../services/spam.js';

class Spam_controller {

    async start(req, res) {

        const password = req.query.password
        if(process.env.SPAM_PASSWORD != password) {
            res.send('👍 რა ყლედ გინდა თორე კი')
            return
        } 
        let is_spam = SPAM_SERVICE.start()
        res.send(`სპამი არის ${is_spam}`)
    }

    async end(req, res) {
        const password = req.query.password
        if(process.env.SPAM_PASSWORD != password) {
            res.send('👍 რა ყლედ გინდა თორე კი')
            return
        } 
        let is_spam = SPAM_SERVICE.end()
        res.send(`სპამი არის ${is_spam}`)
    }
    

  
}

export const Spam_Controller = new Spam_controller()
import puppeteer from 'puppeteer'

class Spam_Service {


    #is_active = false
    start() {
        this.#is_active = true
        this.load_spam_interval()
        return this.#is_active
    }

    end() {
        this.#is_active = false
        return this.#is_active
    }


    async load_spam_interval() {
        try {
            console.log('start spam !!')
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://vinme.ge/');
            await page.click('#startButton')
            await page.waitForSelector('#message')
            const spam_interval = setInterval(async () => {
                await this.spam(page)
                if(!this.#is_active) {
                    clearInterval(spam_interval)
                    console.log('end spam !!')
                    return
                }
            }, 400)
        } catch (error) {
            console.log(error)
        }
    }
    
    spam(page) {
        console.log('spamsss')
        return new Promise(async (resolve, reject) => {
            const message_insert = await page.evaluate(() => {
                const text_area = document.getElementById('message')
                if (!text_area) resolve(false)
                text_area.value = 'zdzd'
                return true
            })
            if (message_insert) {
                await page.waitForSelector('#submit')
                await page.click('#submit')
                setTimeout(async () => {
                    await page.click('#findNextButton')
                    resolve(true)
                }, 200);
            } else {
                resolve(false)
            }
        });
    }




}

const SPAM_SERVICE = new Spam_Service()
export default SPAM_SERVICE

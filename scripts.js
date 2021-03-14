const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('daily.task:annotations')) || []
    },
    set(annotation) {
        localStorage.setItem('daily.task:annotations', JSON.stringify(annotation))
    }
}

const Annotations = {

    all: Storage.get(),

    add(annotation) {
        this.all.push(annotation)
        App.reload()
    },

    remove(index) {
        this.all.splice(index, 1)
        App.reload()
    },

    
}

const DOM = {
    
    annotationContainer: document.querySelector('tbody'),

    addAnnotation(annotation, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = this.createBaseHTML(annotation, index)
        tr.dataset.index = index

        this.annotationContainer.appendChild(tr)
    },

    createBaseHTML(annotation, index) {
        const html = 
        `
            <td>${annotation.annotation}</td>
            <td>${annotation.time}</td>
            <td>
                <img onclick="Annotations.remove(${index})" class="done" src="./assets/done.svg" alt="Feito">
            </td>
        `
        return html
    },
    clearAnnotation() {
        this.annotationContainer.innerHTML = ''
    }
}

Utils = {
    getHour() {
        const date = new Date()
        let hour = date.getHours()
        let min = date.getMinutes()
        let seg = date.getSeconds()

        hour = String(hour) 
        min = String(min) 

        return `${hour}:${min}:${seg}`
    }
}

const Form = {

    annotation: document.querySelector('#annotation'),
    time: document.querySelector('#time'),

    getValues() {
        return {
            annotation: this.annotation.value,
            time: this.time.value
        }
    },

    clearFields() {

        this.annotation.value = ''
        this.time.value = ''
    },

    validateFields() {

        const { annotation, time } = this.getValues()
        if(annotation.trim() === '' || time.trim() === '') {
            throw new Error('Por Favor, preencha todos os campos')
        }
    },

    async submit(event) {

        const { annotation, time } = this.getValues()

        event.preventDefault()
        
        try {
            
            await Notifiyer.init()

            this.validateFields()

            Annotations.add({
                annotation,
                time
            })
            this.clearFields()

        } catch (error) {
            alert(error.message)
        }
    }

}

const Notifiyer = {

    async init() {
       const permission = await Notification.requestPermission()
       if(permission !== 'granted') throw new Error('Permissão negada')
    },

    notify({ title, body }) {
        new Notification(title, { body })
    },

    giveNotify() {
        setInterval(() => {
            Annotations.all.forEach(annotation => {
                if(`${annotation.time}:0` === Utils.getHour()) {
                    this.notify({
                        title: 'Chegou a hora!',
                        body: annotation.annotation
                    })
                }
            })
         }, 1000)
    }
}

const App = {
    init(){
        Annotations.all.forEach((annotation, index) => {
            DOM.addAnnotation(annotation, index)
        })

        Storage.set(Annotations.all)
    },
    reload(){
        DOM.clearAnnotation()
        this.init()
    },
}

Notifiyer.giveNotify()
App.init()





import { cover } from './linkedin'
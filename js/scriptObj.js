'use strict';
(function () {
    const toDoList = {

        selector: null,
        form:null,
        containerSelector:null,
        container:null,
        id:null,

        init(selector,container){
            if (typeof selector === 'string' || selector.trim() !=='') {
                this.selector = selector;
            }

            if (typeof container === 'string' || container.trim() !=='') {
                this.containerSelector = container;
            }

            this.getForm();
            this.getHTMLElement()
            this.deleteItem()

        },

        getForm(){
            const formElement = document.querySelector(this.selector);
            this.form = formElement;


            formElement.addEventListener('submit', event => {
                event.preventDefault();
                event.stopPropagation();

                const data = {};
                this.id +=1
                formElement
                    .querySelectorAll('input, textarea')
                    .forEach((item)=>{

                        data[item.name] = item.value;

                    })
                data.id = this.id
                const savedData = this.saveData(data)

                this.renderItem(savedData)

            })
        },
        getHTMLElement(){

            const toDoContainer = document.querySelector(this.containerSelector);
            this.container = toDoContainer;
            document.addEventListener('DOMContentLoaded',event=>{
                event.stopPropagation();
                event.preventDefault();

                const toDo = JSON.parse(localStorage.getItem(this.selector));

                if (!toDo) return console.log('Saved data is absent');
                if (!toDo) this.id = 0;
                if (toDo) this.id = toDo.length

                toDo.map(item=>this.renderItem(item))
            })

        },

        saveData(data){

            let dataFromStore =  localStorage.getItem(this.selector);

            if (!dataFromStore){
                let array = [];
                array.push(data);
                localStorage.setItem(this.selector,JSON.stringify(array));
            }

            if (dataFromStore) {
                dataFromStore = JSON.parse(dataFromStore);
                dataFromStore.push(data);
                localStorage.setItem(this.selector,JSON.stringify(dataFromStore))
            }

            return data
        },
        renderItem(data){

            const title = data.title
            const description = data.description
            const dataId = data.id

            const wrapper = document.createElement('div');
            wrapper.classList.add('col-4');
            wrapper.setAttribute('data-id',dataId)

            wrapper.innerHTML = `
                        <div class="taskWrapper">
                            <div class="taskHeading">${title}</div>
                            <div class="taskDescription">${description}</div>
                        </div>`;
            this.container.prepend(wrapper);

        },

        deleteItem(){
            this.container.addEventListener('click',event => {
                event.stopPropagation();
                const currentItem = event.target.closest('[data-id]');
                const currentItemId = Number(currentItem.getAttribute('data-id'))

                const filteredData = JSON.parse(localStorage.getItem(this.selector)).filter(item => item.id !== currentItemId );

                localStorage.setItem(this.selector,JSON.stringify(filteredData));

                currentItem.remove()

            })
        }
    }

    toDoList.init('#todoForm', '#todoItems');

})()





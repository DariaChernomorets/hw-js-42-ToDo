'use strict';
(function () {
    class Form {
        form = null
        id = 1
        selector = null
        container = null

        constructor(selector,container) {
            this.selector = selector
            this.container = container

        }


        getForm(){
            const formElement = document.querySelector(this.selector);
            this.form = formElement;

            formElement.addEventListener('submit', event => {
                event.stopPropagation();
                event.preventDefault()
                const data = {};

                formElement
                    .querySelectorAll('input, textarea')
                    .forEach((item)=>{

                        data[item.name] = item.value;

                    })

                const savedData = this.saveData(data)

                this.renderItem(savedData)
            })
        }
        saveData(data){

            let dataFromStore =  localStorage.getItem(this.selector);

            data.id = this.id

              if (!dataFromStore){

                  console.log(data.id)
                  let array = [];
                array.push(data);
                localStorage.setItem(this.selector,JSON.stringify(array));
            }

            if (dataFromStore) {

                dataFromStore = JSON.parse(dataFromStore);
                data.id = dataFromStore.length + 1

                dataFromStore.push(data);
                console.log(data.id)
                localStorage.setItem(this.selector,JSON.stringify(dataFromStore))


            }

            return data
        }

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

        }
    }

    class ToDo extends Form{
        containerSelector = null

        constructor() {
            super();
        }

        init(selector,container){
            if (typeof selector === 'string' || selector.trim() !=='') {
                this.selector = selector;
            }

            if (typeof container === 'string' || container.trim() !=='') {
                this.containerSelector = container;
            }

            super.getForm();
            this.getHTMLElement()
            this.deleteItem()

        }

        getHTMLElement(){

            const toDoContainer = document.querySelector(this.containerSelector);
            this.container = toDoContainer;

            document.addEventListener('DOMContentLoaded',event=>{
                event.stopPropagation();
                event.preventDefault();

                const toDo = JSON.parse(localStorage.getItem(this.selector));

                if (!toDo) return console.log('Saved data is absent');

                toDo.map(item=>super.renderItem(item))
            })

        }
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
    const todo = new ToDo()

    todo.init('#todoForm', '#todoItems')
    console.log(todo);
})()


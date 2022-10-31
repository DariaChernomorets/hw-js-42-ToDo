'use strict';
(function () {

    let id = 0;
    const dataKey = 'formData';
    const form = document.querySelector('#todoForm');
    const toDoItems = document.querySelector('#todoItems');

    if (localStorage.getItem(dataKey) && JSON.parse(localStorage.getItem(dataKey)).length){
        const data = JSON.parse(localStorage.getItem(dataKey));
        id = data[data.length-1].id
    }

    const renderItem = (todoItem) => {

        const wrapper = document.createElement('div');
        wrapper.classList.add('col-4');
        wrapper.setAttribute('data-id',todoItem.id)

        const template = `
                        <div class="taskWrapper">
                            <div class="taskHeading">${todoItem.title}</div>
                            <div class="taskDescription">${todoItem.description}</div>
                        </div>`;

        wrapper.innerHTML = template;
        toDoItems.prepend(wrapper);
        return template
    }

    form.addEventListener('submit', event=>{
        event.preventDefault();
        event.stopPropagation();

        const {target} = event;
        let data = target.querySelectorAll('input, textarea');

        data = Array.from(data)
            .reduce((acc,item)=>{
                acc[item.name] = item.value;
                return acc;
            },{})

        data.id = id+=1;

        const dataToSave = localStorage.getItem(dataKey) ?
            JSON.parse(localStorage.getItem(dataKey)) :
            [];

            dataToSave.push(data)

        localStorage.setItem(dataKey, JSON.stringify(dataToSave));

            renderItem(data)

    } )

    document.addEventListener('DOMContentLoaded',()=>{
        if (!localStorage.getItem(dataKey)) return;
        const data = JSON.parse(localStorage.getItem(dataKey));
        data.forEach(item =>{
            renderItem(item)
        })
    })

    toDoItems.addEventListener('click',event=>{
        event.stopPropagation();
        const currentItem = event.target.closest('[data-id]');
        const currentItemId = Number(currentItem.getAttribute('data-id'));

        const filteredData = JSON
            .parse(localStorage.getItem(dataKey))
            .filter(item=>item.id !== currentItemId);

        localStorage.setItem(dataKey,JSON.stringify(filteredData))

        // with find index
        // const allToDos = JSON.parse(localStorage.getItem(dataKey));
        // const toRemove = allToDos.findIndex((item)=> item.id ===currentItemId);
        // allToDos.splice(toRemove,1)
        // localStorage.setItem(dataKey,JSON.stringify(allToDos))

        currentItem.remove();

    })
})()
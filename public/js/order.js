import {fetchApi, fetchApiWithId , postApi , patchApi} from './api.js'
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io();

socket.on("item-added", () => {
    
});

    let typeOf = new URLSearchParams(window.location.search).get('type');
    let category = await fetchApi('/categorys');

    async function loadItems() {
    let items = await fetchApi('/items');
    // createItemCards(items);

    console.log(items);



    var cateCheck = ''

    const grouped = {};
    items.forEach(item => {
    if (!grouped[item.cate_id]) grouped[item.cate_id] = [];
    grouped[item.cate_id].push(item);
    });

    // Sort each category by order
    for (const cat in grouped) {
    grouped[cat].sort((a, b) => a.order - b.order);
    }

    console.log(grouped);
    
     if(typeOf === 'rails'){
        createItemCards(grouped[1],'abc'); // general supplies
        createItemCards(grouped[2],'none'); // wood
        createItemCards(grouped[3],'abc'); // safety
        createItemCards(grouped[4],'kind'); // fasteners
         createItemCards(grouped[6],'order'); // rails
        //  createItemCards(grouped[2]); // Accessories
     }
     if(typeOf === 'ropes'){
        createItemCards(grouped[7],'abc'); // ropes
        createItemCards(grouped[8],'abc'); // electrical  
        createItemCards(grouped[9],'abc'); // hardware
        createItemCards(grouped[200],'abc'); // accessories      
        createItemCards(grouped[300],'abc'); // safety

     }

     document.querySelector('.hide').style.display = 'block';
    
    
    
}

loadItems();

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createItemCards(itemB,order){


    if(order === 'order'){
        itemB.sort((a, b) => a.order - b.order);
        createCard(itemB);
    }

    if(order === 'kind'){
        let allKinds = {};

        for(let itB of itemB){
            if(!allKinds[nameTillNumber(itB.name, 1)]){
                allKinds[nameTillNumber(itB.name, 1)] = [];
            }
            allKinds[nameTillNumber(itB.name, 1)].push(itB);
        }

        let divB = document.querySelector('.items');

            let categoryFind = category.find(cat => cat.id === itemB[0].cate_id);

            let categoryHeader = document.createElement('div')
            categoryHeader.className = 'categoryHeader'
            categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
            divB.appendChild(categoryHeader)

            console.log(allKinds);
        for(let kind in allKinds){
            
        let containerB = document.createElement('div');
        containerB.className = 'containerB';
        let extraDiv = document.createElement('div');
        extraDiv.className = 'extraDiv';
        let mainExtra = document.createElement('div');
        mainExtra.className = 'mainExtra';

        let name = document.createElement('div');
        name.className = 'name';
        name.innerHTML = `<p style="font-size: 25px">${kind}</p>`;
        let img = document.createElement('div');
        img.className = 'pic';
        img.innerHTML = `<img src="/${allKinds[kind][0].img}" alt="" onerror="this.src='/pic/Asset 3@4x.png'">`
        mainExtra.appendChild(name);
        mainExtra.appendChild(img);
        containerB.appendChild(mainExtra);
        divB.appendChild(containerB);
            allKinds[kind].sort((a, b) => parseSize(a.size) - parseSize(b.size));
            for(let it of allKinds[kind]){
                let container = document.createElement('div');
                container.className = 'li'
                container.id = it.id;

                let name = document.createElement('div');
                name.className = 'name';
                name.innerHTML = `${nameTillNumber(it.name, 2)}`;

                let quantity = document.createElement('div');
                quantity.className = 'quantity';
                quantity.innerHTML = `<input type="number" placeholder="0"></input>`;
                container.appendChild(name);
                container.appendChild(quantity);
                extraDiv.appendChild(container);

            }

            containerB.appendChild(extraDiv);
            
        }

        

       
    }

    if(order === 'abc' || order === 'none'){
        createCard(itemB);
    }

}

function createCard(item){
    let div = document.querySelector('.items');

    let categoryFind = category.find(cat => cat.id === item[0].cate_id);

    let categoryHeader = document.createElement('div')
    categoryHeader.className = 'categoryHeader'
    categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
    div.appendChild(categoryHeader)
    
            

    for(let it of item){


        let container = document.createElement('div');
        container.className = 'container';
        container.id = it.id;

        let pic = document.createElement('div');
        pic.className = 'pic';
        pic.innerHTML = `<img src="/${it.img}" alt="" onerror="this.src='/pic/Asset 3@4x.png'">`
        container.appendChild(pic);

        let name = document.createElement('div');
        name.className = 'name';
        name.innerHTML = `<p>${it.name}</p>`;
        container.appendChild(name);

        let quantity = document.createElement('div');
        quantity.className = 'quantity';
        quantity.innerHTML = `<input type="number" placeholder="0"></input>`;
        container.appendChild(quantity);
        div.appendChild(container);
    }
}

function createList(items){

}

function nameTillNumber(str, number) {
    // Match: everything up to the first number, then everything after (including x, -, /, spaces, etc.)
    const match = str.match(/^(.*?)(\d.*)$/);
    // match[1] = name, match[2] = number/size (including "x" and more)
    if (number == 1) {
        return match ? match[1].trim() : str;
    } else if (number == 2) {
        return match ? match[2].trim() : '';
    }
}

function parseSize(size) {
    if (!size) return 0;
    // Handle fractions like "5/8"
    if (size.includes('/')) {
        const [num, denom] = size.split('/').map(Number);
        return denom ? num / denom : num;
    }
    // Handle mixed numbers like "1 1/2"
    if (size.match(/^\d+ \d+\/\d+$/)) {
        const [whole, fraction] = size.split(' ');
        const [num, denom] = fraction.split('/').map(Number);
        return Number(whole) + (denom ? num / denom : num);
    }
    // Handle plain numbers
    return parseFloat(size) || 0;
}
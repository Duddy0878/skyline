import {fetchApi, fetchApiWithId , postApi , patchApi} from './api.js';

 let category = await fetchApi('/categorys');

 async function loadItems() {
     let items = await fetchApi('/items');

 
     const grouped = {};
     items.forEach(item => {
     if (!grouped[item.cate_id]) grouped[item.cate_id] = [];
     grouped[item.cate_id].push(item);
     });
 
     // Sort each category by order
     for (const cat in grouped) {
     grouped[cat].sort((a, b) => a.order - b.order);
     }
 
     
         createItemCards(grouped[1],'abc'); // general supplies
         createItemCards(grouped[2],'none'); // wood
         createItemCards(grouped[3],'abc'); // safety
         createItemCards(grouped[4],'kind'); // fasteners
         createItemCards(grouped[5],'kind'); // bits
         createItemCards(grouped[6],'order'); // rails // unknown
         createItemCards(grouped[7],'emt'); // electrical
         createItemCards(grouped[8],'order'); // troughing
         createItemCards(grouped[9],'abc'); // kindorf
         createItemCards(grouped[10],'order'); // wires
         createItemCards(grouped[12],'ropes'); // ropes
         createItemCards(grouped[13],'abc'); // cab     
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
            createCard(allKinds[kind]);
            
        }

        

       
    }

    if(order === 'abc' || order === 'none'){
        createCard(itemB);
    }

    if(order === 'emt'){
        let sizes = {
            "3/8": [],
            "1/2": [],
            "3/4": [],
            "1-1/2": [],
            "else": []

        };
        for(let itB of itemB){
            if(itB.size === '3/8' || itB.size === 3/8){
                sizes['3/8'].push(itB);
            }
            if(itB.size === '1/2' || itB.size === 1/2){
                sizes['1/2'].push(itB);
            }
            if(itB.size === '3/4' || itB.size === 3/4){

                sizes['3/4'].push(itB);
            }
            if(itB.size === '1-1/2' || itB.size === 1-1/2){

                sizes['1-1/2'].push(itB);
            }
            if(!itB.size) {
                sizes['else'].push(itB);
            }
        }

        for(let size in sizes){
            sizes[size].sort((a, b) => a.order - b.order);
             if(size === 'else'){
                createCard(sizes[size]);
             }
             else{

                 createCard(sizes[size],'emt',size);
             }
        }
        
        // createCard(itemB);
    }

    if(order === 'ropes'){

        createCard(itemB,'ropes');

    }

    }

    function createCard(item,yes=false,word){
        let div = document.querySelector('.items');

        if(!yes){


        let categoryFind = category.find(cat => cat.id === item[0].cate_id);

        let categoryHeader = document.createElement('div')
        categoryHeader.className = 'categoryHeader'
        categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
        div.appendChild(categoryHeader)
        }
        if(yes === 'emt'){
        
        let categoryHeader = document.createElement('div')
        categoryHeader.className = 'categoryHeader'
        categoryHeader.innerHTML = `<h2>EMT ${upperCaseFirstLetter(word)}" </h2>`
        div.appendChild(categoryHeader)
        
        }
        if(yes === 'ropes'){

        let categoryFind = category.find(cat => cat.id === item[0].cate_id);

        let categoryHeader = document.createElement('div')
        categoryHeader.className = 'categoryHeader'
        categoryHeader.innerHTML = `<h2> ${upperCaseFirstLetter(categoryFind.name)} </h2>`
        div.appendChild(categoryHeader)
        
        let ropeContainer = document.createElement('div');
        ropeContainer.className = 'ropeContainer';
    
        ropeContainer.innerHTML = `
            <div class="ropeItem">
            <h2> Requested Ropes Package : &nbsp; <input type="checkbox" /> </h2><br/>
            Includes: Hoist Ropes, governer Ropes, whisper flex, 
            and shackles with springs,
            dampning device kit,
            compsaation chain installation kit, <br/>
            travel cable, travel multi, hoistway ropes,
            kellem grips, hitch brackets,
        `

        div.appendChild(ropeContainer);


        }
        
        const table = document.createElement('table');
        table.className = 'itemTable';
        div.appendChild(table);

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `<th>ID</th><th>Name</th><th>Shop Price</th><th>Quantity</th><th>Mega</th><th>Draka</th><th>wurtec</th>`;
            table.appendChild(headerRow);

        for(let it of item){

            let container = document.createElement('tr');
            container.id = it.id;

            container.innerHTML = `<td>${it.id}</td>
                            <td>${it.name}</td>
                            <td>$${it.shop ? it.shop : 0}</td>
                            <td>${it.quantity ? it.quantity : 0}</td>
                            <td>$${it.mega} </td>
                            <td>$${it.draka} </td>
                            <td>$${it.wurtec} </td>
            `
            table.appendChild(container);
        }
    }

    loadItems();
    
    function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

function editItem() {
    let status = false;
    document.querySelector(`.items`).addEventListener('dblclick', async (e) => {
        e.preventDefault();
        status = true;
        let itemId = e.target.closest('tr').id;
        let item = await fetchApiWithId('/items', itemId);

        
        const tr = e.target.closest('tr');
        let measure = tr.querySelector('td:nth-child(2)').getBoundingClientRect().width;
        console.log(measure);
        
        tr.innerHTML = `
            <td>${tr.id}</td>
            <td><input type="text" value="${item.name}" /></td>
            <td><input type="number" value="${item.shop}" /></td>
            <td><input type="number" value="${item.quantity}" /></td>
            <td><input type="number" value="${item.mega}" /></td>
            <td><input type="number" value="${item.draka}" /></td>
            <td><input type="number" value="${item.wurtec}" /></td>
        `;

        tr.querySelector('td:nth-child(2)').style.width = `${measure}px`;
        const inputs = tr.querySelectorAll('input');
        document.addEventListener('click', async (e) => {
            if (!tr.contains(e.target) && status === true) {
                const updatedItem = {
                    name: inputs[0].value,
                    shop: parseFloat(inputs[1].value),
                    quantity: parseFloat(inputs[2].value),
                    mega: parseFloat(inputs[3].value),
                    draka: parseFloat(inputs[4].value),
                    wurtec: parseFloat(inputs[5].value)
                };
                let response = await patchApi(`/items`, itemId, updatedItem);
                console.log(response);
                
                if (response.success) {
                    alert('Item updated successfully');
                } else {
                    alert('Failed to update item');
                }
                tr.innerHTML = `
                    <td>${tr.id}</td>
                    <td>${updatedItem.name}</td>
                    <td>$${updatedItem.shop}</td>
                    <td>${updatedItem.quantity}</td>
                    <td>$${updatedItem.mega}</td>
                    <td>$${updatedItem.draka}</td>
                    <td>$${updatedItem.wurtec}</td>
                `;
                
                status = false;
            }
        })
    })
}

editItem()
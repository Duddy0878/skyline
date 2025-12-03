import {fetchApi, fetchApiWithId , postApi} from './api.js'

        loadItems()
        loadCategorys()
        addItem()

        async function loadItems(){

         let items = await fetchApi('/items')

         let itemsDiv = document.querySelector('.items')
         itemsDiv.innerHTML = ''

         for (const item of items) {
            let category = await fetchApiWithId('/category',item.cate_id)
            console.log(category,category.color);

            let container = document.createElement('div')
            container.className = 'container'

            let pic = document.createElement('div')
            pic.className = 'pic'
            pic.innerHTML = `<img src="${item.img}" alt="" onerror="this.src='https://raw.githubusercontent.com/Duddy0878/skyline/main/pic/Asset%203%404x.png'">`
            container.appendChild(pic)

            let name = document.createElement('div')
            name.className = 'name'
            name.innerHTML = `<p> ${item.name} </p> `
            container.appendChild(name)

            let cate = document.createElement('div')
            cate.className = 'cate'
            container.appendChild(cate)
            cate.style.background = category.color

            itemsDiv.appendChild(container)
         }
      
           }

        async function loadCategorys(){
            
            let categorys = await fetchApi('/categorys')
            console.log(categorys);
            
            let select = document.querySelector('.newF form select[name="categorysN"]')
            for (const category of categorys) {
                let option = document.createElement('option')
                option.value = category.id
                option.innerText = category.name
                select.appendChild(option)
            }
        }


        async function addItem(){
          
           let click = document.querySelector('.newF form button[type="submit"]')

           click.addEventListener('click', async (e)=>{
                e.preventDefault();
                let name = document.querySelector('.newF form input[name="name"]').value
                let img = 'https://raw.githubusercontent.com/Duddy0878/skyline/main/pic/' + document.querySelector('.newF form input[name="img"]').value
                let cate_id = document.querySelector('.newF form select[name="categorysN"]').value
                let size = document.querySelector('.newF form input[name="size"]').value
                
                if (!name || !cate_id ){
                    let empty = '';
    
                    if (!name) empty += 'Name and ';
                    if (!cate_id) empty += 'Category ';
                    swal.fire({
                        title: `Please fill in ${empty}!`,
                        background: 'black',
                        color: 'red',
                        border: '#FAB519 5px solid',
                        // *** This is where you add your logo image path ***
                        imageUrl: 'https://raw.githubusercontent.com/Duddy0878/skyline/main/pic/red.png', 
                        imageWidth: 200, // Set the width of your logo
                        imageHeight: 200, // Set the height of your logo
                        imageAlt: 'Custom Logo', // Alternative text for accessibility
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'red',
                        customClass: {
                            popup: 'my-swal-popup'
                        }                        
                    })
                }



                let data = {
                    name: name,
                    img: img,
                    cate_id: cate_id,
                    size: size
                }

                let response = await postApi('/items', data)
                if (response.success){
                swal.fire({
                    title: 'Item added successfully!',
                    background: 'black',
                    color: '#FAB519',
                    border: '#FAB519 5px solid',
                    // *** This is where you add your logo image path ***
                    imageUrl: 'https://raw.githubusercontent.com/Duddy0878/skyline/main/pic/Asset%203%404x.png', 
                    imageWidth: 200, // Set the width of your logo
                    imageHeight: 200, // Set the height of your logo
                    imageAlt: 'Custom Logo', // Alternative text for accessibility
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'my-swal-popup'
                    }
                 })
                }
                document.querySelector('.newF form').reset()
                loadItems()
           })
        }







<<<<<<< HEAD
import {fetchApi, fetchApiWithId , postApi} from './api.js'

        loadItems()
        loadCategorys()
        buttonsClick()
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

        function buttonsClick(){
            let click = document.querySelector('.side .buttons')

            click.addEventListener('click', (e)=>{
                let btn = e.target
                let id = btn.id
                if(id === 'more'){
                    document.querySelector(`.forms`).classList.remove('active')
                    return
                }
                document.querySelector(`.forms`).classList.add('active')
                document.querySelectorAll('.forms > div').forEach(div => {
                    div.style.display = 'none'
                })              
                document.querySelector(`.forms .${id}`).style.display = 'GRID'

            })
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
                    name,
                    img,
                    cate_id,
                    size
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

        function calculateRopeLength(){
            let ropingType = document.querySelector('.ropeForm select').value
            let pit = feetCalculater(document.querySelector('.ropeForm input[placeholder="pit"]').value)
            let travel = feetCalculater(document.querySelector('.ropeForm input[placeholder="travel"]').value)
            let overhead = feetCalculater(document.querySelector('.ropeForm input[placeholder="overhead"]').value)
            let ropeDrop = feetCalculater(document.querySelector('.ropeForm input[placeholder="rope Drop"]').value)
            let halfWayBox  = document.querySelector('.ropeForm input[name="halfWayBox"]').checked
            let doubleWrap  = document.querySelector('.ropeForm input[name="doubleWrap"]').checked

            let totalTravel = pit + travel + overhead + ropeDrop
             console.log(ropingType);
             
            // results
            let hoist = 0

            if(ropingType === '1:1'){
                if(doubleWrap){
                    hoist = Math.round((totalTravel + 384) / 12 )
                }
                else{
                    hoist = Math.round((totalTravel + 240) / 12 )
                }
            }else{
                hoist = Math.round((totalTravel * 2 + 240) / 12 )
            }

            let governer = Math.round((totalTravel) * 2 / 12)
            let whisperFlex = Math.round((totalTravel) / 12)

            let travelCable = 0
            let travelMulti = 0
            let hoistway = Math.round((pit + travel + overhead) / 12)

            if(halfWayBox){
                travelCable = Math.round(((totalTravel / 2) + 120) / 12)
                travelMulti = Math.round((totalTravel + 480) / 12)
            }
            else{
                travelCable = Math.round((totalTravel + 960) / 12)
            }

            return {
                hoistRope: roundUpToNearest5(hoist) ,
                governerRope: roundUpToNearest5(governer) ,
                whisperFlexRope: roundUpToNearest5(whisperFlex) ,
                travelCableRope: roundUpToNearest5(travelCable) ,
                travelMultiRope: roundUpToNearest5(travelMulti) ,
                hoistwayRope: roundUpToNearest5(hoistway)
            }


        }

        document.querySelector('.ropeForm button[type="submit"]').addEventListener('click', async (e)=>{
            e.preventDefault();

             let jobs = await fetchApi('jobs')
            inputSelect(jobs, document.querySelector('.ropeOutput #jobsRope'),'Jobs')


            let results = calculateRopeLength()
            document.querySelector('.ropeForm').style.display = 'none'
            document.querySelector('.ropeOutput').style.display = 'grid'

            document.querySelector('.ropeOutput input[name="hoistRope"]').value = results.hoistRope + ' ft'
            document.querySelector('.ropeOutput input[name="governerRope"]').value = results.governerRope + ' ft'
            document.querySelector('.ropeOutput input[name="whisperFlex"]').value = results.whisperFlexRope + ' ft'
            document.querySelector('.ropeOutput input[name="travelCable"]').value = results.travelCableRope + ' ft'
            document.querySelector('.ropeOutput input[name="travelMulti"]').value = results.travelMultiRope + ' ft'
            document.querySelector('.ropeOutput input[name="hoistway"]').value = results.hoistwayRope + ' ft'

            document.querySelectorAll('.ropeOutput button').forEach(async (btn) => {
                
                btn.addEventListener('click', async (e) => {
                    let bId = e.target 
                    
                    if(document.querySelector('.ropeOutput #jobsRope').value === '' || document.querySelector('.ropeOutput input[name="car"]').value === ''){

                        swal.fire({
                            title: `Please fill in Job And Car!`,
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
                   return
                }

                let data = {
                  hoist_rope: results.hoistRope,
                  governer_rope: results.governerRope ,
                  whisper_flex: results.whisperFlexRope,
                  travel_cable: results.travelCableRope,
                  travel_multi: results.travelMultiRope,
                  hoistway: results.hoistwayRope,
                  job_id: document.querySelector('.ropeOutput #jobsRope').value,
                  car: document.querySelector('.ropeOutput input[name="car"]').value
                } 

                
                if(bId.id === 'placeOrder'){
                     alert('order placed')
                }
               
                let response = await postApi('/ropes', data)
                if (response.success){
                swal.fire({
                    title: 'Measurments added successfully!',
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
                  document.querySelectorAll('.ropeOutput input').forEach((rope) =>{
                    rope.value = ''
                  })
                  document.querySelector('.ropeOutput #jobsRope').innerHTML = ''

                  document.querySelector(`.forms`).classList.remove('active')
                
                }
            })
                

            })

        })

        function feetCalculater(input){
         const parts = input.trim().split('.');
            let feet = 0, inches = 0;
            if (parts.length === 2) {
                feet = parseInt(parts[0], 10);
                inches = parseInt(parts[1], 10);
                if (isNaN(feet)) feet = 0;
                if (isNaN(inches)) inches = 0;
            } else if (parts.length === 1) {
                feet = parseInt(parts[0], 10);
                if (isNaN(feet)) feet = 0;
            } else {
                return 'Invalid format';
            }
            if (inches >= 12) {
                return 'Inches should be less than 12';
            }
            return (feet * 12) + inches;
        }

        function roundUpToNearest5(value) {
            console.log('1',Math.ceil(value), '2', Math.ceil(value / 5), '3', Math.ceil(value / 5) * 5);
            
            return Math.ceil(value / 5) * 5;
        }

        function inputSelect(select,input, main){
             const option1 = document.createElement('option')
                option1.innerHTML = main
                input.appendChild(option1)
                
            select.forEach( (selc) => {
                const option = document.createElement('option')
                option.innerHTML = selc.address
                option.value = selc.id
                
                input.appendChild(option)
            })
        }






=======
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






>>>>>>> 555b5673a9630787cebed4fe2bedd59dfb0982e7

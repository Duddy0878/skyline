const target = document.querySelector('.select');
target.addEventListener('click', (e) => {

    if(e.target.classList.contains('rails')){
        window.location.href = '/html/order.html?type=rails'
    }
    else if(e.target.classList.contains('ropes')){
        window.location.href = '/html/order.html?type=ropes'
    }
})
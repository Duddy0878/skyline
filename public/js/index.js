const target = document.querySelector('.select > div');
if (target) {
    target.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        window.location.href = "./html/order.html?type=rails";
    });
}
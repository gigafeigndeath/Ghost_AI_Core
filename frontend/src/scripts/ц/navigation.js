const navButtons = document.querySelectorAll('.nav-btn');
const navArrow = document.getElementById('navArrow');
const rightNavRect = document.getElementById('rightNav').getBoundingClientRect();

function placeArrowOn(button) {
    const rect = button.getBoundingClientRect();
    const centerX = (rect.left + rect.right) / 2 - rightNavRect.left;
    navArrow.style.left = centerX + 'px';
}

const initial = document.querySelector('.nav-btn[data-active="true"]') || navButtons[0];
placeArrowOn(initial);

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.setAttribute('data-active', 'false'));
        btn.setAttribute('data-active', 'true');
        placeArrowOn(btn);
    });
});

window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-btn[data-active="true"]');
    placeArrowOn(active);
});

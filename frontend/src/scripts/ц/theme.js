const body = document.body;
const switchEl = document.getElementById('themeSwitch');
let isLight = true;

function updateSwitchUI() {
    switchEl.setAttribute('data-mode', isLight ? 'light' : 'dark');
    switchEl.setAttribute('aria-checked', String(isLight));
}

function toggleTheme() {
    isLight = !isLight;
    body.classList.toggle('light-theme', isLight);
    updateSwitchUI();
}

updateSwitchUI();
switchEl.addEventListener('click', toggleTheme);

switchEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
    }
});

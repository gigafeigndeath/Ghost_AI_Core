const showImageBtn = document.getElementById('showImageBtn');
const imageContainer = document.getElementById('imageContainer');

showImageBtn.addEventListener('click', () => {
    imageContainer.classList.toggle('show');
});

// Design Switcher Script
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.design-btn');
    const container = document.getElementById('design-container');
    const iframe = document.querySelector('.design-frame');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch design
            const designName = btn.dataset.design;
            iframe.src = `${designName}/index.html`;
        });
    });
});
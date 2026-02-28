const modal = document.getElementById('authModal');

function openModal(tab) {
    modal.classList.add('open');
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('openSignin').addEventListener('click', e => { e.preventDefault(); openModal('signin'); });
document.getElementById('openRegister').addEventListener('click', e => { e.preventDefault(); openModal('register'); });
document.getElementById('openRegisterHero').addEventListener('click', e => { e.preventDefault(); openModal('register'); });
document.getElementById('openRegisterCTA').addEventListener('click', e => { e.preventDefault(); openModal('register'); });
document.getElementById('openSigninCTA').addEventListener('click', e => { e.preventDefault(); openModal('signin'); });
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => openModal(tab.dataset.tab));
});
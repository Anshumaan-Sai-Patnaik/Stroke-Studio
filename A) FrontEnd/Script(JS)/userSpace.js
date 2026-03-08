function openModal(id)  { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }

document.getElementById('openSignOutNav').addEventListener('click', () => openModal('signOutModal'));
document.getElementById('openSignOutMobile').addEventListener('click', () => openModal('signOutModal'));

document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.getElementById('signOutModal').addEventListener('click', e => {
    if (e.target === document.getElementById('signOutModal')) closeModal('signOutModal');
});
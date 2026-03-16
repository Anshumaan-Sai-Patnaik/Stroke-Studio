function openModal(id)  { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }
document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.getElementById('openSignOutNav').addEventListener('click', () => openModal('signOutModal'));
document.getElementById('openSignOutMobile').addEventListener('click', () => openModal('signOutModal'));
document.getElementById('signOutModal').addEventListener('click', e => {
    if (e.target === document.getElementById('signOutModal')) closeModal('signOutModal');
});


document.getElementById('openEditProfile').addEventListener('click', () => {
    resetEditModal();
    openModal('editProfileModal');
});
document.getElementById('editProfileModal').addEventListener('click', e => {
    if (e.target === document.getElementById('editProfileModal')) closeModal('editProfileModal');
});


function showEditFeedback(type, msg) {
    const el = document.getElementById('editFeedback');
    el.className = `acct-feedback ${type} visible`;
    el.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check' : 'fa-circle-exclamation'}"></i> ${msg}`;
    if (type === 'success') setTimeout(() => { el.classList.remove('visible'); }, 3500);
}
function setHint(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg;
    const colors = {
        ok: 'rgba(80,200,120,0.8)',
        error: 'rgba(220,100,100,0.75)',
        warn: 'rgba(220,160,50,0.8)',
    };
    el.style.color = colors[type];
}

function resetEditModal() {
    setPwSectionLocked(true);
    document.getElementById('editCurrentPw').value = '';
    document.getElementById('editCurrentPw').disabled = false;
    document.getElementById('editNewPw').value = '';
    document.getElementById('editNewPw').disabled = true;
    document.getElementById('editConfirmPw').value = '';
    document.getElementById('editConfirmPw').disabled = true;
    document.getElementById('currentPwHint').textContent = '';
    document.getElementById('pwMatchHint').textContent = '';

    const vBtn = document.getElementById('verifyCurrentPwBtn');
    vBtn.classList.remove('verified');
    vBtn.style.pointerEvents = '';
    vBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';

    const fb = document.getElementById('editFeedback');
    fb.className = 'acct-feedback';
    fb.innerHTML = '';

    document.getElementById('editUsername').value = document.querySelector('.profile-name').textContent;
}
function setPwSectionLocked(locked) {
    const section = document.getElementById('pwNewSection');
    section.classList.toggle('locked', locked);
    section.classList.toggle('unlocked', !locked);
}
async function verifyCurrentPassword() {
    const checkPassword = document.getElementById('editCurrentPw').value.trim();
    const btn = document.getElementById('verifyCurrentPwBtn');

    if (!checkPassword) {
        setHint('currentPwHint', 'Please enter your current password.', 'warn');
        return;
    }

    const res = await fetch(`/user/${userInfo.userID}/update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            checkPassword
        })
    });
    const data = await res.json();

    if (data.message === false) {
        setHint('currentPwHint', 'Incorrect password. Please try again.', 'error');
        document.getElementById('editCurrentPw').select();
        return;
    }

    setHint('currentPwHint', '✓ Password verified', 'ok');
    btn.classList.add('verified');
    btn.style.pointerEvents = 'none';
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    document.getElementById('editCurrentPw').disabled = true;

    setPwSectionLocked(false);
    document.getElementById('editNewPw').disabled = false;
    document.getElementById('editConfirmPw').disabled = false;
    setTimeout(() => document.getElementById('editNewPw').focus(), 100);
}
function checkPwMatch() {
    const pw1 = document.getElementById('editNewPw').value;
    const pw2 = document.getElementById('editConfirmPw').value;
    if (!pw2) { document.getElementById('pwMatchHint').textContent = ''; return; }
    if (pw1 === pw2) setHint('pwMatchHint', '✓ Passwords match', 'ok');
    else setHint('pwMatchHint', '✗ Passwords do not match', 'error');
}

document.getElementById('verifyCurrentPwBtn').addEventListener('click', verifyCurrentPassword);
document.getElementById('editCurrentPw').addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyCurrentPassword();
});
document.getElementById('editConfirmPw').addEventListener('input', checkPwMatch);
document.getElementById('saveProfileBtn').addEventListener('click', async () => {
    const username   = document.getElementById('editUsername').value.trim();
    const newPw      = document.getElementById('editNewPw').value;
    const confirmPw  = document.getElementById('editConfirmPw').value;
    const pwUnlocked = document.getElementById('pwNewSection').classList.contains('unlocked');
    
    if (!username) {
        showEditFeedback('error', 'Username cannot be empty.');
        return;
    }
    if (pwUnlocked && newPw && newPw !== confirmPw) {
        showEditFeedback('error', 'New passwords do not match.');
        return;
    }
    const btn = document.getElementById('saveProfileBtn');
    document.getElementById('cancelSave').style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';
    const start = Date.now();
    try {
        const payload = { username };
        if (pwUnlocked && newPw) {
            payload.newPassword = newPw;
        }
        const res = await fetch(`/user/${userInfo.userID}/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        const elapsed = Date.now() - start;
        if (elapsed < 500) {
            const delay = new Promise(resolve => {
                setTimeout(resolve, 500 - elapsed);
            });
            await delay;
        }

        if (res.ok && data.ok) {
            document.querySelector('.profile-name').textContent = username;
            document.querySelector('.nav-user-name strong').textContent = username;
            document.querySelector('.signout-body strong').textContent = username;
            document.querySelector('.danger-type-label strong').textContent = username;
            showEditFeedback('success', 'Profile updated successfully.');
        } else {
            showEditFeedback('error', data.message || 'Failed to save changes.');
        }
    } catch {
        showEditFeedback('error', 'Network error — changes not saved.');
    } finally {
        document.getElementById('cancelSave').style.display = '';
        btn.disabled  = false;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
    }
});

document.getElementById('openDeleteAccount').addEventListener('click',  () => {
    resetDeleteModal();
    openModal('deleteAccountModal');
});
document.getElementById('deleteAccountModal').addEventListener('click', e => {
    if (e.target === document.getElementById('deleteAccountModal')) closeModal('deleteAccountModal');
});

function resetDeleteModal() {
    document.getElementById('deleteConfirmCheck').checked = false;
    document.getElementById('deleteConfirmInput').value = '';
    checkDeleteReady();
}

function checkDeleteReady() {
    const checked = document.getElementById('deleteConfirmCheck').checked;
    const typed   = document.getElementById('deleteConfirmInput').value.trim();
    const btn     = document.getElementById('confirmDeleteBtn');
    const USERNAME = document.querySelector(".danger-type-label strong").textContent;
    btn.disabled  = !(checked && typed === USERNAME);
}

document.getElementById('deleteConfirmCheck').addEventListener('change', checkDeleteReady);
document.getElementById('deleteConfirmInput').addEventListener('input',  checkDeleteReady);

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    document.getElementById('cancelDelete').style.display = 'none';
    const btn = document.getElementById('confirmDeleteBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting…';
    const start = Date.now();

    try {
        const res = await fetch(`/user/${userInfo.userID}/delete`, {
            method: 'DELETE'
        });

        const elapsed = Date.now() - start;
        if (elapsed < 500) {
            const delay = new Promise(resolve => {
                setTimeout(resolve, 500 - elapsed);
            });
            await delay;
        }

        if (res.ok) window.location.href = 'http://localhost:3000/home';
    } catch (err) {
        document.getElementById('cancelDelete').style.display = '';
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete My Account';
    }
});

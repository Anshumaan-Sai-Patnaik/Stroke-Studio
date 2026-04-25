let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}


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
    uploadedImageUrl = null;
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

    const hasImage = currentImageUrl !== 'Uploads/!NoProfilePic';
    const avatarImg = document.querySelector("#editAvatarPreview img");
    avatarImg.src = hasImage ? currentImageUrl : '/' + currentImageUrl.replace('Uploads/', '') + '.jpg';
    document.getElementById('editUsername').value = document.querySelector('.profile-name').textContent;
    
    document.getElementById('editAvatarPreview').classList.toggle('has-image', hasImage);
    document.getElementById('editAvatarPreview').classList.toggle('no-image', !hasImage);
}

let currentImageUrl = document.querySelector("#editAvatarPreview img").src.includes('!NoProfilePic.jpg') ? 'Uploads/!NoProfilePic' : document.querySelector("#editAvatarPreview img").src;
let uploadedImageUrl = null;
document.getElementById("avatarFileInput").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
        const res = await fetch("/user/upload-avatar", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (res.ok) {
            uploadedImageUrl = data.imageUrl;
            document.querySelector("#editAvatarPreview img").src = uploadedImageUrl;
            document.getElementById('editAvatarPreview').classList.toggle('has-image', true);
            document.getElementById('editAvatarPreview').classList.toggle('no-image', false);
        } else {
            console.error(data.message);
        }
    } catch (err) {
        console.error("Upload failed", err);
    }
});
document.querySelector("#avatarDeleteOverlay i").addEventListener('click', function () {
    uploadedImageUrl = 'Uploads/!NoProfilePic';
    document.querySelector("#editAvatarPreview img").src = '/' + 'Uploads/!NoProfilePic'.replace('Uploads/', '') + '.jpg'
    document.getElementById('editAvatarPreview').classList.toggle('has-image', false);
    document.getElementById('editAvatarPreview').classList.toggle('no-image', true);
});
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

    const res = await fetch(`/user/${userInfo.userID}/update-profile`, {
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
        if (uploadedImageUrl) {
            payload.image = uploadedImageUrl;
        }
        const res = await fetch(`/user/${userInfo.userID}/update-profile`, {
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
            
            const avatarImg = document.querySelector(".profile-avatar img");
            if (uploadedImageUrl) {
                avatarImg.src = uploadedImageUrl === 'Uploads/!NoProfilePic' ? '/' + uploadedImageUrl.replace('Uploads/', '') + '.jpg' : uploadedImageUrl;
                currentImageUrl = uploadedImageUrl;
                uploadedImageUrl = null;
            }

            showEditFeedback('success', 'Profile updated successfully.');
            showToast('Profile saved');
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
        showToast('Network error — could not delete account');
    }
});


const WORKS_MAP = {};
ALL_WORKS.forEach(p => {
    p._id = String(p._id);
    WORKS_MAP[p._id] = p;
});
let cart = CART_IDS.map(id => WORKS_MAP[id]).filter(Boolean);
let wishlist = WISH_IDS.map(id => WORKS_MAP[id]).filter(Boolean);
const purchased = PURCHASED_IDS.map(id => WORKS_MAP[id]).filter(Boolean);

function calcCartTotal() {
    return cart.reduce((sum, p) => {
        const price = Number(p.price.replace(/[^\d.]/g, ""));
        return sum + price;
    }, 0);
}
function renderCartSummary() {
    const total = calcCartTotal().toLocaleString('en-IN');
    document.getElementById('cartTotal').textContent = total;
    document.getElementById('cartItemCount').textContent  = cart.length;
    document.getElementById("cartItemLabel").textContent = cart.length === 1 ? "item" : "items";
    document.getElementById('cartBadge').textContent = cart.length;
    document.getElementById('cartBadgeMobile').textContent = cart.length;
    document.getElementById('csmTotal').textContent = total;
    document.getElementById('csmItemCount').textContent  = cart.length;
    document.getElementById("csmItemLabel").textContent = cart.length === 1 ? "item" : "items";

    const btn1 = document.getElementById('checkoutBtn');
    const btn2 = document.getElementById('csmCheckoutBtn');
    if (cart.length > 0) {
        btn1.classList.remove('empty');
        btn2.classList.remove('empty');
    } else {
        btn1.classList.add('empty');
        btn2.classList.add('empty');
    }
}
function renderStabCount() {
    document.getElementById('sideCartCount').textContent  = cart.length;
    document.getElementById('sideWishCount').textContent  = wishlist.length;
    document.getElementById('sidePurchasedCount').textContent = purchased.length;
    document.getElementById('sideGalleryCount').textContent   = ALL_WORKS.length;
}

function switchTab(targetId) {
    document.querySelectorAll('.stab').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`.stab[data-target="${targetId}"]`).classList.add('active');
    document.getElementById(targetId).classList.add('active');
}

document.querySelectorAll('.stab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.target));
});

document.getElementById('navCartBtn').addEventListener('click', () => switchTab('panel-cart'));
document.getElementById('mobileCartToggle').addEventListener('click', () => { switchTab('panel-cart'); openModal('cartSummaryModal'); });


function buildRow(painting, mode) {
    const row = document.createElement('div');
    row.className = 'painting-row';

    const mediumText = painting.medium;
    const styleText  = (painting.style === "Unknown") ? '' : painting.style;
    const yearText   = painting.year;

    let actionHTML = '';
    if (mode === 'cart') {
        actionHTML = `
            <div class="painting-row-price">${painting.price}</div>
            <div class="painting-row-btns">
                <button class="row-btn wishlist-add" title="Move to Wishlist" data-action="cart-to-wish" data-id="${painting._id}">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <button class="row-btn remove" title="Remove" data-action="cart-remove" data-id="${painting._id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    } else if (mode === 'wish') {
        actionHTML = `
            <div class="painting-row-price">${painting.price}</div>
            <div class="painting-row-btns">
                <button class="row-btn" title="Add to Cart" data-action="wish-to-cart" data-id="${painting._id}">
                    <i class="fa-solid fa-bag-shopping"></i>
                </button>
                <button class="row-btn remove" title="Remove" data-action="wish-remove" data-id="${painting._id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    } else if (mode === 'purchased') {
        actionHTML = `
            <div>
                <div class="painting-row-price">${painting.price}</div>
                <div style="margin-top:0.4rem;"><span class="purchased-badge"><i class="fa-solid fa-check" style="margin-right:0.3rem;"></i>Acquired</span></div>
            </div>
        `;
    }

    row.innerHTML = `
        <div class="painting-row-thumb">
            <img src="${'../' + painting.image.replace('A) FrontEnd/', '') + '.jpg'}" loading="lazy"/>
        </div>
        <div class="painting-row-info">
            <div class="painting-row-title">${painting.title}</div>
            <div class="painting-row-meta">
                ${`<span>${painting.artist}</span> ·`}
                ${mediumText} ${styleText ? '· ' + styleText : ''} ${'· ' + yearText}
            </div>
        </div>
        <div class="painting-row-actions">${actionHTML}</div>
    `;
    return row;
}

function renderList(paintings, containerId, emptyId, metaId, mode) {
    const containerEl = document.getElementById(containerId);
    const emptyEl   = document.getElementById(emptyId);
    const metaEl    = document.getElementById(metaId);

    containerEl.innerHTML = '';
    if (paintings.length === 0) {
        emptyEl.style.display = 'flex';
        metaEl.textContent = '';
        return;
    }
    emptyEl.style.display = 'none';
    metaEl.textContent = `${paintings.length} work${paintings.length > 1 ? 's' : ''}`;

    paintings.forEach(p => containerEl.appendChild(buildRow(p, mode)));
}

function renderAll() {
    renderList(cart, 'cartList', 'cartEmpty', 'cartHeaderMeta', 'cart');
    renderList(wishlist, 'wishList', 'wishEmpty', 'wishHeaderMeta', 'wish');
    renderList(purchased, 'purchasedList', 'purchasedEmpty', 'purchasedHeaderMeta', 'purchased');
    renderCartSummary();
    renderStabCount();
    renderGallery();
}
renderAll();


function inCart(id)     { return cart.some(p => p._id === id); }
function inWishlist(id) { return wishlist.some(p => p._id === id); }
async function syncServer(action, paintingId) {
    try {
        await fetch(`/user/${userInfo.userID}/update-list`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action, paintingId
            })
        });
    } catch (e) { }
}

function addToCart(painting) {
    if (inCart(painting._id)) { showToast('Already in cart'); return; }
    cart.push(painting);
    syncServer('cart-add', painting._id);
    showToast(`"${painting.title}" added to cart`);
    renderAll();
}
function removeFromCart(id) {
    cart = cart.filter(p => p._id !== id);
    syncServer('cart-remove', id);
    renderAll();
}
function addToWishlist(painting) {
    if (inWishlist(painting._id)) { showToast('Already in wishlist'); return; }
    wishlist.push(painting);
    syncServer('wish-add', painting._id);
    showToast(`"${painting.title}" saved to wishlist`);
    renderAll();
}
function removeFromWishlist(id) {
    wishlist = wishlist.filter(p => p._id !== id);
    syncServer('wish-remove', id);
    renderAll();
}

document.getElementById('cartList').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const painting = cart.find(p => p._id === id);
    if (!painting) return;

    if (btn.dataset.action === 'cart-remove')  removeFromCart(id);
    if (btn.dataset.action === 'cart-to-wish') { removeFromCart(id); addToWishlist(painting); }
});
document.getElementById('wishList').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const painting = wishlist.find(p => p._id === id);
    if (!painting) return;

    if (btn.dataset.action === 'wish-remove')  removeFromWishlist(id);
    if (btn.dataset.action === 'wish-to-cart') { removeFromWishlist(id); addToCart(painting); }
});


function renderGallery() {
    document.querySelectorAll('.gallery-item-info').forEach(parent => {
        const existing = parent.querySelector('.gallery-item-btns');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'gallery-item-btns';
        const id = String(parent.dataset.id);

        const isCart = inCart(id);
        const isWish = inWishlist(id);
        div.innerHTML = `
            <button class="gallery-btn ${isCart ? 'in-cart' : ''}" data-action="g-cart" data-id="${id}">
                <i class="fa-solid fa-bag-shopping"></i>
                ${isCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button class="gallery-btn ${isWish ? 'in-wish' : ''}" data-action="g-wish" data-id="${id}">
                <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                ${isWish ? 'Saved' : 'Wishlist'}
            </button>
        `;
        parent.appendChild(div);
    });
}
renderGallery();

const allItems = Array.from(document.querySelectorAll('.gallery-item'));
let searchQuery = '';

function matchesSearch(item) {
    if (!searchQuery) return true;
    const text = [
        item.dataset.title,
        item.dataset.artist,
        item.dataset.medium,
        item.dataset.style
    ].join(' ').toLowerCase();
    return text.includes(searchQuery);
}
function applySearchAndReset() {
    allItems.forEach(item => {
        if (matchesSearch(item)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
    const total = allItems.filter(i => matchesSearch(i)).length;
    if (total === allItems.length) document.getElementById('galleryResultMeta').textContent = `${total} Works in Collection`;
    else document.getElementById('galleryResultMeta').textContent = `${total} Result${total === 1 ? '' : 's'} for "${searchQuery}"`;
    
    if (total === 0) document.getElementById('galleryEmpty').style.display = 'flex';
    else document.getElementById('galleryEmpty').style.display = 'none';
}
function doSearch() {
    searchQuery = document.getElementById('gallerySearchInput').value.trim().toLowerCase();
    applySearchAndReset();
}

document.getElementById('gallerySearchBtn').addEventListener('click', doSearch);
document.getElementById('gallerySearchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
});

document.getElementById('gallerySearchInput').addEventListener('input', function() {
    if (this.value === '') {
        searchQuery = '';
        applySearchAndReset();
    }
});

document.getElementById('masonryGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const painting = ALL_WORKS.find(p => String(p._id) === id);
    if (!painting) return;

    if (btn.dataset.action === 'g-cart') {
        if (inCart(id)) { showToast('Already in cart'); }
        else { addToCart(painting); }
    }
    if (btn.dataset.action === 'g-wish') {
        if (inWishlist(id)) { showToast('Already in wishlist'); }
        else { addToWishlist(painting); }
    }
});

const detailBackdrop = document.getElementById('detailModal');
const detailClose = document.getElementById('closeDetail');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;

        const d = item.dataset;
        document.getElementById('detailImg').src = d.img;
        document.getElementById('detailTitle').textContent = d.title;
        document.getElementById('detailArtist').textContent = d.artist;
        document.getElementById('detailYear').textContent = d.year;
        (d.style === "Unknown") ? document.getElementById('detailStyle').style.display = "none" : (document.getElementById('detailStyle').style.display = "", document.getElementById('detailStyle').textContent = d.style);
        document.getElementById('detailMediumBadge').textContent = d.medium;
        document.getElementById('detailMetaMedium').textContent = d.medium;
        (d.style === "Unknown") ? document.getElementById('detailMetaStyle').textContent = "—" : (document.getElementById('detailMetaStyle').style.display = "", document.getElementById('detailMetaStyle').textContent = d.style);
        document.getElementById('detailMetaDimensions').textContent = d.dimensions;
        document.getElementById('detailMetaYear').textContent = d.year;
        document.getElementById('detailPrice').textContent = d.price.replace('₹', '').trim();

        let parent = document.querySelector('.detail-info');
        const existing = parent.querySelector('.detail-actions');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'detail-actions';
        const id = String(d.id);

        const isCart = inCart(id);
        const isWish = inWishlist(id);
        div.innerHTML = `
            <button class="detail-btn detail-btn-primary ${isCart ? ' in-cart' : ''}" data-action="g-cart" data-id="${id}">
                <i class="fa-solid fa-bag-shopping"></i>
                ${isCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button class="detail-btn detail-btn-secondary ${isWish ? ' in-wish' : ''}" data-action="g-wish" data-id="${id}">
                <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                ${isWish ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
        `;
        parent.appendChild(div);

        detailBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelector('.detail-info').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const painting = ALL_WORKS.find(p => String(p._id) === id);
    if (!painting) return;

    if (btn.dataset.action === 'g-cart') {
        if (inCart(id)) { showToast('Already in cart'); }
        else {
            addToCart(painting);
            btn.classList.add('in-cart');
            btn.innerHTML = `
                <i class="fa-solid fa-bag-shopping"></i>
                In Cart
            `;
        }
    }
    if (btn.dataset.action === 'g-wish') {
        if (inWishlist(id)) { showToast('Already in wishlist'); }
        else {
            addToWishlist(painting);
            btn.classList.add('in-wish');
            btn.innerHTML = `
                <i class="fa-solid fa-heart"></i>
                Saved to Wishlist
            `;
        }
    }
});

function closeDetail() {
    detailBackdrop.classList.remove('open');
    document.body.style.overflow = '';

    const iterModal = document.querySelector('.detail-modal');
    if (iterModal) {
        iterModal.style.transform = '';
        iterModal.style.transition = '';
    }
};

detailClose.addEventListener('click', closeDetail);
detailBackdrop.addEventListener('click', e => { if (e.target === detailBackdrop) closeDetail(); });

const interactiveModal = document.querySelector('.detail-modal');

document.addEventListener('mousemove', (e) => {
    if (!detailBackdrop.classList.contains('open')) return;
    if (window.innerWidth <= 930) return; // Disable on small screens

    const rect = interactiveModal.getBoundingClientRect();
    
    // Check if mouse is hovering the modal
    if (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -6;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6;

        interactiveModal.style.transition = 'transform 0.1s ease-out';
        interactiveModal.style.transform = `perspective(1200px) translateY(0) scale(1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else {
        interactiveModal.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        interactiveModal.style.transform = '';
    }
});
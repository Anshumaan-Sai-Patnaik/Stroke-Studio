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
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => openModal(tab.dataset.tab));
});


const mobileOverlay = document.getElementById('mobileSearchOverlay');

document.getElementById('mobileSearchToggle').addEventListener('click', () => {
    mobileOverlay.classList.add('active');
    mobileInput.focus();
});

document.getElementById('mobileSearchClose').addEventListener('click', () => {
    mobileOverlay.classList.remove('active');
    mobileInput.value = '';
});

document.getElementById('mobileSignin').addEventListener('click', e => { e.preventDefault(); openModal('signin'); });
document.getElementById('mobileRegister').addEventListener('click', e => { e.preventDefault(); openModal('register'); });


const allItems = Array.from(document.querySelectorAll('.gallery-item'));
const TOTAL = allItems.length;
const BATCH = 12;
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

function countVisible()  { return allItems.filter(i => !i.classList.contains('hidden')).length; }
function countFiltered() { return allItems.filter(i => matchesSearch(i)).length; }

function updateUI() {
    const showing = countVisible();
    const total = countFiltered();
    const pct = total > 0 ? Math.round((showing / total) * 100) : 100;

    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = `Showing ${showing} of ${total}`;
    document.getElementById('pageCount').textContent = `${TOTAL} works in the collection`;

    const btn = document.getElementById('showMoreBtn');
    if (showing >= total) {
        btn.classList.add('all-loaded');
        btn.innerHTML = `<i class="fa-solid fa-check"></i> All Works Loaded`;
    } else {
        btn.classList.remove('all-loaded');
        btn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Load More Paintings`;
    }
}

function applySearchAndReset() {
    let shown = 0;
    allItems.forEach(item => {
        if (matchesSearch(item) && shown < BATCH) {
            item.classList.remove('hidden');
            shown++;
        } else {
            item.classList.add('hidden');
        }
    });
    updateUI();
}


function doSearch() {
    searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    applySearchAndReset();
}

document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
});

document.getElementById('searchInput').addEventListener('input', function() {
    if (this.value === '') {
        searchQuery = '';
        applySearchAndReset();
    }
});

function doMobileSearch() {
    searchQuery = document.getElementById('searchInputMobile').value.trim().toLowerCase();
    applySearchAndReset();
    mobileOverlay.classList.remove('active');
}

document.getElementById('searchBtnMobile').addEventListener('click', doMobileSearch);
document.getElementById('searchInputMobile').addEventListener('keydown', e => {
    if (e.key === 'Enter') doMobileSearch();
});

document.getElementById('searchInputMobile').addEventListener('input', function() {
    if (this.value === '') {
        searchQuery = '';
        applySearchAndReset();
    }
});


const detailBackdrop = document.getElementById('detailModal');
const detailClose = document.getElementById('closeDetail');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
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

        detailBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeDetail() {
    detailBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

detailClose.addEventListener('click', closeDetail);
detailBackdrop.addEventListener('click', e => { if (e.target === detailBackdrop) closeDetail(); });


document.getElementById('showMoreBtn').addEventListener('click', () => {
    let added = 0;
    allItems.forEach(item => {
        if (item.classList.contains('hidden') && matchesSearch(item) && added < BATCH) {
            item.classList.remove('hidden');

            const delay = added * 40;
            item.style.opacity = '0';
            item.style.transform = 'translateY(18px)';
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, delay);
            added++;
        }
    });
    updateUI();
});


updateUI();


const form = document.getElementById("tab-signin");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-signin").value;
    const password = document.getElementById("pass-signin").value;

    const response = await fetch("http://localhost:3000/user/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!data.success) {
        document.getElementById("login-error").innerText = data.message;
    } else {
        window.location.href = `http://localhost:3000/user/${data.user.userID}`;
    }
});
// DOM 요소들
const characterCards = document.querySelectorAll('.character-card');
const expandBtns = document.querySelectorAll('.expand-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const characterImgs = document.querySelectorAll('.character-img');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');

// 페이지 로드 시 애니메이션 및 초기화
document.addEventListener('DOMContentLoaded', function() {
    characterCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.classList.add('fade-in');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    handleImageLoading();
    initVideoTabs();
});

// 영상 탭 전환 초기화
function initVideoTabs() {
    document.querySelectorAll('.video-item').forEach(item => {
        const videos = item.querySelectorAll('video');
        const tabs = item.querySelectorAll('.video-tab');
        if (tabs.length && videos.length) {
            videos.forEach((v, i) => { if (i !== 0) v.classList.add('hidden'); });
            tabs.forEach((t, i) => {
                if (i === 0) t.classList.add('active');
                t.addEventListener('click', () => {
                    tabs.forEach(tab => tab.classList.remove('active'));
                    t.classList.add('active');
                    videos.forEach((v, vi) => {
                        if (vi === i) { v.classList.remove('hidden'); v.play().catch(()=>{}); }
                        else { v.pause(); v.classList.add('hidden'); }
                    });
                });
            });
        }
    });
}

// 이미지 로딩 처리
function handleImageLoading() {
    characterImgs.forEach(img => {
        img.addEventListener('load', function() { this.classList.add('loaded'); });
        if (img.complete) { img.classList.add('loaded'); }
    });
}

// 자세히 보기 토글
expandBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const details = document.getElementById(targetId);
        const icon = this.querySelector('.btn-icon');
        const btnText = this.querySelector('.btn-text');
        if (details.classList.contains('active')) {
            details.classList.remove('active');
            this.classList.remove('active');
            icon.textContent = '▼';
            btnText.textContent = '자세히 보기';
        } else {
            details.classList.add('active');
            this.classList.add('active');
            icon.textContent = '▲';
            btnText.textContent = '접기';
            setTimeout(() => { details.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
        }
    });
});

// 정면/후면 전환
viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const view = this.getAttribute('data-view');
        const card = this.closest('.character-card');
        const images = card.querySelectorAll('.character-img');
        const buttons = card.querySelectorAll('.view-btn');
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        images.forEach(img => img.classList.toggle('active', img.getAttribute('data-view') === view));
    });
});

// 이미지 모달
characterImgs.forEach(img => {
    img.addEventListener('click', function() {
        modalImage.src = this.src;
        modalImage.alt = this.alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});
closeModal.addEventListener('click', closeModalFn);
modal.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.style.display === 'block') closeModalFn(); });
function closeModalFn() { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }

// 스크롤 인뷰 애니메이션
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
characterCards.forEach(card => observer.observe(card));

// 스와이프 전환
let touchStartX = 0, touchEndX = 0;
characterCards.forEach(card => {
    card.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    card.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(card); });
});
function handleSwipe(card) {
    const diff = touchStartX - touchEndX;
    const images = card.querySelectorAll('.character-img');
    const activeImg = card.querySelector('.character-img.active');
    if (Math.abs(diff) > 50) {
        if (diff > 0 && activeImg.getAttribute('data-view') === 'front') switchToView(card, 'back', images);
        else if (diff < 0 && activeImg.getAttribute('data-view') === 'back') switchToView(card, 'front', images);
    }
}
function switchToView(card, view, images) {
    card.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-view') === view));
    images.forEach(img => img.classList.toggle('active', img.getAttribute('data-view') === view));
}

// 반응형 레이아웃 보정
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const isMobile = window.innerWidth <= 768;
        characterCards.forEach(card => { card.style.margin = isMobile ? '0 10px' : '0'; });
    }, 250);
});
window.addEventListener('load', function() {
    const isMobile = window.innerWidth <= 768;
    characterCards.forEach(card => { if (isMobile) card.style.margin = '0 10px'; });
});

// 로드 실패 대체
characterImgs.forEach(img => {
    img.addEventListener('error', function() {
        this.style.background = 'var(--color-bg-tertiary)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.color = 'var(--color-text-muted)';
        this.style.fontSize = '1rem';
    });
});

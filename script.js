// DOM 요소들
const characterCards = document.querySelectorAll('.character-card');
const expandBtns = document.querySelectorAll('.expand-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const characterImgs = document.querySelectorAll('.character-img');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');

// 페이지 로드 시 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    // 캐릭터 카드들에 페이드인 애니메이션 적용
    characterCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.classList.add('fade-in');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 이미지 로딩 처리
    handleImageLoading();
});

// 이미지 로딩 처리
function handleImageLoading() {
    characterImgs.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // 이미 로드된 이미지 처리
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
}

// 자세히 보기 버튼 이벤트
expandBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const details = document.getElementById(targetId);
        const icon = this.querySelector('.btn-icon');
        const btnText = this.querySelector('.btn-text');
        
        if (details.classList.contains('active')) {
            // 닫기
            details.classList.remove('active');
            this.classList.remove('active');
            icon.textContent = '▼';
            btnText.textContent = '자세히 보기';
        } else {
            // 열기
            details.classList.add('active');
            this.classList.add('active');
            icon.textContent = '▲';
            btnText.textContent = '접기';
            
            // 부드러운 스크롤 효과
            setTimeout(() => {
                details.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    });
});

// 이미지 전환 버튼 이벤트
viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const view = this.getAttribute('data-view');
        const card = this.closest('.character-card');
        const images = card.querySelectorAll('.character-img');
        const buttons = card.querySelectorAll('.view-btn');
        
        // 모든 버튼 비활성화
        buttons.forEach(btn => btn.classList.remove('active'));
        // 클릭한 버튼 활성화
        this.classList.add('active');
        
        // 이미지 전환
        images.forEach(img => {
            if (img.getAttribute('data-view') === view) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    });
});

// 이미지 클릭 시 모달 열기
characterImgs.forEach(img => {
    img.addEventListener('click', function() {
        modalImage.src = this.src;
        modalImage.alt = this.alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// 모달 닫기
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// 모달 배경 클릭 시 닫기
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// 스크롤 시 카드 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 모든 캐릭터 카드 관찰
characterCards.forEach(card => {
    observer.observe(card);
});

// 터치 이벤트 지원 (모바일)
let touchStartX = 0;
let touchEndX = 0;

characterCards.forEach(card => {
    card.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    card.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(card);
    });
});

function handleSwipe(card) {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const images = card.querySelectorAll('.character-img');
        const buttons = card.querySelectorAll('.view-btn');
        const activeImg = card.querySelector('.character-img.active');
        const activeBtn = card.querySelector('.view-btn.active');
        
        if (diff > 0) {
            // 왼쪽으로 스와이프 - 다음 이미지
            if (activeImg.getAttribute('data-view') === 'front') {
                switchToView(card, 'back', images, buttons);
            }
        } else {
            // 오른쪽으로 스와이프 - 이전 이미지
            if (activeImg.getAttribute('data-view') === 'back') {
                switchToView(card, 'front', images, buttons);
            }
        }
    }
}

function switchToView(card, view, images, buttons) {
    // 모든 버튼 비활성화
    buttons.forEach(btn => btn.classList.remove('active'));
    // 해당 뷰 버튼 활성화
    const targetBtn = card.querySelector(`[data-view="${view}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    // 이미지 전환
    images.forEach(img => {
        if (img.getAttribute('data-view') === view) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    });
}

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // 포커스된 요소에 시각적 표시
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('expand-btn') || 
            focusedElement.classList.contains('view-btn')) {
            focusedElement.style.outline = '2px solid var(--color-accent)';
            focusedElement.style.outlineOffset = '2px';
        }
    }
});

// 이미지 로드 실패 시 대체 처리
characterImgs.forEach(img => {
    img.addEventListener('error', function() {
        this.style.background = 'var(--color-bg-tertiary)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.color = 'var(--color-text-muted)';
        this.style.fontSize = '1rem';
        this.innerHTML = '이미지를 불러올 수 없습니다';
    });
});

// 성능 최적화: 디바운스된 리사이즈 이벤트
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // 모바일/데스크탑 전환 시 레이아웃 재조정
        const isMobile = window.innerWidth <= 768;
        characterCards.forEach(card => {
            if (isMobile) {
                card.style.margin = '0 10px';
            } else {
                card.style.margin = '0';
            }
        });
    }, 250);
});

// 초기 레이아웃 설정
window.addEventListener('load', function() {
    const isMobile = window.innerWidth <= 768;
    characterCards.forEach(card => {
        if (isMobile) {
            card.style.margin = '0 10px';
        }
    });
});

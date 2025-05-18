document.addEventListener('DOMContentLoaded', function() {
    // 모든 링크 스크롤 함수 정의
    function smoothScroll(targetElement) {
        if (targetElement) {
            // 헤더 높이 계산
            const headerHeight = document.querySelector('header').offsetHeight;
            
            // 모바일에서는 추가 여백 제공
            const isMobile = window.innerWidth <= 768;
            const mobileOffset = isMobile ? 50 : 30;
            
            // 요소의 실제 위치 계산
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight - mobileOffset;
            
            // 스크롤 이동
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // 모바일 메뉴 토글 기능
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // 메뉴 항목 클릭 시 메뉴 닫기
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // 현재 페이지 내 링크인 경우에만 처리
                const targetId = this.getAttribute('href');
                
                if (targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    
                    // 모바일 메뉴 닫기
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    
                    const targetElement = document.querySelector(targetId);
                    
                    // 약간의 지연 후 스크롤 이동 (메뉴 닫힘 애니메이션 후)
                    setTimeout(() => {
                        smoothScroll(targetElement);
                    }, 300);
                } else {
                    // 외부 페이지 링크면 메뉴만 닫기
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        });
    }
    
    // 스크롤시 헤더 스타일 변경
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 입력 필드 스타일 처리
    const inputFields = document.querySelectorAll('input');
    if (inputFields.length > 0) {
        inputFields.forEach(input => {
            // 초기 배경색 설정
            input.style.backgroundColor = 'var(--dark)';
            input.style.background = 'var(--dark)';
            
            // 입력 및 포커스 이벤트
            ['focus', 'input', 'change', 'blur'].forEach(eventType => {
                input.addEventListener(eventType, function() {
                    this.style.backgroundColor = 'var(--dark)';
                    this.style.background = 'var(--dark)';
                    setTimeout(() => {
                        this.style.backgroundColor = 'var(--dark)';
                        this.style.background = 'var(--dark)';
                    }, 10);
                });
            });
        });
    }
    
    // iOS에서 100vh 문제 해결
    const setVhVariable = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVhVariable();
    window.addEventListener('resize', setVhVariable);
    
    // 탭 기능
    const tabs = document.querySelectorAll('.screening-tab');
    const panels = document.querySelectorAll('.screening-panel');

    if (tabs.length > 0 && panels.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                const target = this.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
    }
    
    // 로그인 모달 기능
    const signupButton = document.querySelector('.buy-tickets');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    const closeAndRedirect = document.querySelector('.close-and-redirect');
    
    if (signupButton && loginModal) {
        signupButton.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    if (closeAndRedirect) {
        closeAndRedirect.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            
            // 현재 페이지가 index.html이면 페이지 내 스크롤, 아니면 socialring.html로 이동
            const redirectTarget = this.getAttribute('href');
            if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                const targetElement = document.querySelector(redirectTarget);
                if (targetElement) {
                    smoothScroll(targetElement);
                }
            } else {
                window.location.href = 'socialring.html' + redirectTarget;
            }
        });
    }
    
    if (loginModal) {
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
    
    // 로그아웃 알림 버튼 이벤트 처리
    const logoutCancelBtn = document.getElementById('logout-cancel');
    const logoutConfirmBtn = document.getElementById('logout-confirm');
    const logoutNotification = document.getElementById('logout-notification');
    
    if (logoutCancelBtn && logoutNotification) {
        logoutCancelBtn.addEventListener('click', function() {
            logoutNotification.style.display = 'none';
        });
    }
    
    if (logoutConfirmBtn && logoutNotification) {
        logoutConfirmBtn.addEventListener('click', function() {
            // 로그아웃 처리
            localStorage.removeItem('token');
            localStorage.setItem('isLoggedIn', 'false');
            
            // 알림 닫기
            logoutNotification.style.display = 'none';
            
            // 로그아웃 알림
            alert('로그아웃 되었습니다.');
            
            // UI 업데이트
            updateAuthUI(false, null);
            
            // 페이지 메인으로 이동
            window.location.href = 'index.html';
        });
    }
    
    // 인증 상태에 따른 UI 업데이트
    function updateAuthUI(isLoggedIn, username) {
        const signupButton = document.querySelector('.buy-tickets');
        const footerLoginBtn = document.getElementById('footer-login');
        
        if (isLoggedIn) {
            // 로그인/로그아웃 버튼 변경
            if (signupButton) {
                signupButton.querySelector('span').textContent = '로그아웃';
                
                // 이전 이벤트 리스너 제거 (클론 후 교체 방식으로 확실하게)
                const newButton = signupButton.cloneNode(true);
                signupButton.parentNode.replaceChild(newButton, signupButton);
                
                // 로그아웃 이벤트 리스너 추가
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('logout-notification').style.display = 'flex';
                });
            }
            
            // 푸터 로그인 링크 변경
            if (footerLoginBtn) {
                footerLoginBtn.textContent = '로그아웃';
                
                // 이전 이벤트 리스너 제거
                const newFooterBtn = footerLoginBtn.cloneNode(true);
                footerLoginBtn.parentNode.replaceChild(newFooterBtn, footerLoginBtn);
                
                // 푸터 로그아웃 버튼 클릭 이벤트
                newFooterBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('logout-notification').style.display = 'flex';
                });
            }
        } else {
            // 로그인/로그아웃 버튼 복원
            if (signupButton) {
                signupButton.querySelector('span').textContent = '로그인';
                
                // 이전 이벤트 리스너 제거 (클론 후 교체 방식으로 확실하게)
                const newButton = signupButton.cloneNode(true);
                signupButton.parentNode.replaceChild(newButton, signupButton);
                
                // 로그인 이벤트 리스너 추가
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('login-modal').style.display = 'flex';
                });
            }
            
            // 푸터 로그인 링크 변경
            if (footerLoginBtn) {
                footerLoginBtn.textContent = '로그인';
                
                // 이전 이벤트 리스너 제거
                const newFooterBtn = footerLoginBtn.cloneNode(true);
                footerLoginBtn.parentNode.replaceChild(newFooterBtn, footerLoginBtn);
                
                // 푸터 로그인 버튼 클릭 이벤트
                newFooterBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('login-modal').style.display = 'flex';
                });
            }
        }
    }
    
    // 페이지 로드 시 로그인 상태 확인 및 UI 업데이트
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateAuthUI(isLoggedIn);
 
    // 프로젝트 및 컬렉션 이미지 최적화
    const optimizeProjectImages = () => {
        // 프로젝트 이미지 최적화
        const projectImages = document.querySelectorAll('.project-image img');
        if (projectImages.length > 0) {
            projectImages.forEach(img => {
                // 이미지가 로드된 후 처리
                if (img.complete) {
                    handleImageOptimization(img);
                } else {
                    img.addEventListener('load', () => {
                        handleImageOptimization(img);
                    });
                }
            });
        }
        
        // 컬렉션 이미지 최적화
        const collectionImages = document.querySelectorAll('.collection-image img');
        if (collectionImages.length > 0) {
            collectionImages.forEach(img => {
                // 이미지가 로드된 후 처리
                if (img.complete) {
                    handleImageOptimization(img);
                } else {
                    img.addEventListener('load', () => {
                        handleImageOptimization(img);
                    });
                }
            });
        }
    };
    
    // 이미지 최적화 처리 함수
    const handleImageOptimization = (img) => {
        const container = img.parentElement;
        
        // 이미지 비율 유지하면서 컨테이너에 맞추기
        if (img.naturalWidth > img.naturalHeight) {
            // 가로가 더 긴 이미지
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.transform = 'translateY(-25%)';
        } else {
            // 세로가 더 긴 이미지
            img.style.width = 'auto';
            img.style.height = '100%';
            img.style.transform = 'translateX(-25%)';
        }
    };
    
    // 페이지 로드시 이미지 최적화 실행
    optimizeProjectImages();
    
    // 윈도우 리사이즈시 이미지 최적화 다시 실행
    window.addEventListener('resize', optimizeProjectImages);
}); 
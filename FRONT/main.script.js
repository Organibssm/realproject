// =====================================================
// 다크/라이트 모드 — 슬링샷 박쥐 토글
// 사용법: HTML에 #themeToggle 버튼과 #bat 요소 필요
//         body에 .dark-mode 클래스로 모드 전환
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  (function initDarkModeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const bat = document.getElementById('bat');

    if (!themeToggle || !bat) {
      console.warn("Theme toggle or slingshot bat elements not found.");
      return;
    }

    // 테마 초기 설정 복원
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.textContent = '🌙';
    }

    // 버튼 직접 클릭 토글 지원
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    let isPullingBat = false;
    let pullOriginX = 0, pullOriginY = 0;

    function getBatCenter() {
      const r = bat.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    function getToggleCenter() {
      const r = themeToggle.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    // 박쥐 드래그 시작
    bat.addEventListener('mousedown', (e) => {
      isPullingBat = true;
      const c = getBatCenter();
      pullOriginX = c.x; pullOriginY = c.y;
      bat.style.transition = 'none';
      bat.style.cursor = 'grabbing';
      e.preventDefault(); e.stopPropagation();
    });

    // 드래그 이동 (고무줄 효과)
    document.addEventListener('mousemove', (e) => {
      if (!isPullingBat) return;
      const dx = e.clientX - pullOriginX;
      const dy = e.clientY - pullOriginY;
      const maxPull = 120;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const cdx = dist > maxPull ? dx * (maxPull / dist) : dx;
      const cdy = dist > maxPull ? dy * (maxPull / dist) : dy;
      bat.style.transform =
        `translate(${cdx}px,${cdy}px) rotate(${cdx * 0.3}deg) scale(${1 + dist * 0.003})`;
    });

    // 발사
    document.addEventListener('mouseup', (e) => {
      if (!isPullingBat) return;
      isPullingBat = false;
      bat.style.cursor = 'grab';

      const dx = e.clientX - pullOriginX;
      const dy = e.clientY - pullOriginY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 너무 짧게 당기면 취소
      if (dist < 40) {
        bat.style.transition = 'transform 0.3s ease-out';
        bat.style.transform = 'translate(0,0) rotate(0deg) scale(1)';
        return;
      }

      const speed = Math.min(dist, 120);
      const vx = -(dx / dist) * speed * 6;
      const vy = -(dy / dist) * speed * 6;

      const startRect = bat.getBoundingClientRect();

      // 날아다니는 박쥐 복사본 생성
      const flyingBat = document.createElement('div');
      flyingBat.textContent = '🦇';
      flyingBat.style.cssText = `
        position:fixed; font-size:32px;
        left:${startRect.left}px; top:${startRect.top}px;
        z-index:9999; pointer-events:none; transition:none;
        transform-origin:center;
      `;
      document.body.appendChild(flyingBat);

      // 원래 박쥐 원위치
      bat.style.transition = 'transform 0.3s ease-out';
      bat.style.transform = 'translate(0,0) rotate(0deg) scale(1)';

      // 물리 시뮬레이션
      let posX = startRect.left, posY = startRect.top;
      let velX = vx, velY = vy;
      const gravity = 0.8;
      let frame = 0, hit = false;
      const toggleCenter = getToggleCenter();

      function animate() {
        if (hit) return;
        velY += gravity;
        posX += velX * 0.05;
        posY += velY * 0.05;
        frame++;

        flyingBat.style.left = posX + 'px';
        flyingBat.style.top  = posY + 'px';
        flyingBat.style.transform =
          `rotate(${frame * (velX > 0 ? 15 : -15)}deg)`;

        // 화면 밖 이탈 → 미스
        if (posX < -100 || posX > window.innerWidth + 100
            || posY > window.innerHeight + 100) {
          flyingBat.remove();
          showMissEffect();
          return;
        }

        // 토글 버튼 충돌 판정 (반지름 28px)
        const d = Math.sqrt(
          Math.pow(posX - toggleCenter.x, 2) +
          Math.pow(posY - toggleCenter.y, 2)
        );
        if (d < 28) {
          hit = true;
          flyingBat.remove();
          themeToggle.classList.add('hit');
          document.body.classList.toggle('dark-mode');
          const isDark = document.body.classList.contains('dark-mode');
          themeToggle.textContent = isDark ? '☀️' : '🌙';
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          showHitEffect(toggleCenter.x, toggleCenter.y);
          setTimeout(() => themeToggle.classList.remove('hit'), 300);
          return;
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    });

    // 명중 이펙트
    function showHitEffect(x, y) {
      for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.textContent = ['💥','⭐','✨','🌟'][Math.floor(Math.random() * 4)];
        star.style.cssText = `
          position:fixed; font-size:20px;
          left:${x}px; top:${y}px; z-index:9999;
          pointer-events:none; transition:all 0.6s ease-out;
          transform:translate(-50%,-50%);
        `;
        document.body.appendChild(star);
        setTimeout(() => {
          star.style.transform =
            `translate(${(Math.random()-0.5)*120}px,${(Math.random()-0.5)*120}px) scale(0)`;
          star.style.opacity = '0';
        }, 20);
        setTimeout(() => star.remove(), 700);
      }
    }

    // 미스 이펙트
    function showMissEffect() {
      const miss = document.createElement('div');
      miss.textContent = '빗나감! 🎯';
      miss.style.cssText = `
        position:fixed; top:80px; right:30px;
        background:#ef4444; color:white;
        padding:8px 16px; border-radius:8px; z-index:9999;
        font-size:14px; font-weight:bold;
        animation:slideInOut 1.5s ease forwards;
      `;
      document.body.appendChild(miss);
      setTimeout(() => miss.remove(), 1500);
    }

    // 미스 키프레임 동적 삽입
    if (!document.getElementById('miss-keyframes')) {
      const style = document.createElement('style');
      style.id = 'miss-keyframes';
      style.textContent = `
        @keyframes slideInOut {
          0%   { opacity:0; transform:translateX(20px); }
          20%  { opacity:1; transform:translateX(0); }
          80%  { opacity:1; transform:translateX(0); }
          100% { opacity:0; transform:translateX(20px); }
        }
      `;
      document.head.appendChild(style);
    }

    // ===== 로그인 / 회원가입 모달 기능 추가 =====
    const loginModal = document.getElementById('loginModal');
    const loginOpenBtn = document.getElementById('loginOpenBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabSignupBtn = document.getElementById('tabSignupBtn');
    const signupNameGroup = document.getElementById('signupNameGroup');
    const signupAgreeGroup = document.getElementById('signupAgreeGroup');
    
    const studentNameInput = document.getElementById('studentName');
    const privacyAgreeCheckbox = document.getElementById('privacyAgree');
    const submitFormBtn = document.getElementById('submitFormBtn');
    const loginForm = document.getElementById('loginForm');
    
    let currentTab = 'login'; // 'login' 또는 'signup'
    
    // 모달 초기 상태 설정 (회원가입 필드는 숨김 상태로 시작)
    if (signupNameGroup && signupAgreeGroup) {
      signupNameGroup.style.display = 'none';
      signupAgreeGroup.style.display = 'none';
    }
    
    function openModal() {
      if (!loginModal) return;
      loginModal.classList.add('active');
      loginModal.setAttribute('aria-hidden', 'false');
      // 첫 입력필드 포커스
      const studentIdInput = document.getElementById('studentId');
      if (studentIdInput) setTimeout(() => studentIdInput.focus(), 150);
    }
    
    function closeModal() {
      if (!loginModal) return;
      loginModal.classList.remove('active');
      loginModal.setAttribute('aria-hidden', 'true');
      if (loginForm) loginForm.reset();
      switchTab('login');
    }
    
    function switchTab(tab) {
      currentTab = tab;
      if (!tabLoginBtn || !tabSignupBtn || !signupNameGroup || !signupAgreeGroup || !studentNameInput || !privacyAgreeCheckbox || !submitFormBtn) return;
      
      if (tab === 'login') {
        tabLoginBtn.classList.add('active');
        tabSignupBtn.classList.remove('active');
        signupNameGroup.style.display = 'none';
        signupAgreeGroup.style.display = 'none';
        studentNameInput.removeAttribute('required');
        privacyAgreeCheckbox.removeAttribute('required');
        submitFormBtn.textContent = '로그인';
      } else {
        tabLoginBtn.classList.remove('active');
        tabSignupBtn.classList.add('active');
        signupNameGroup.style.display = 'flex';
        signupAgreeGroup.style.display = 'block';
        studentNameInput.setAttribute('required', 'true');
        privacyAgreeCheckbox.setAttribute('required', 'true');
        submitFormBtn.textContent = '회원가입';
      }
    }
    
    if (loginOpenBtn) {
      loginOpenBtn.addEventListener('click', openModal);
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // 모달 바깥 배경 클릭 시 닫기
    if (loginModal) {
      loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
          closeModal();
        }
      });
    }
    
    // ESC 키 입력 시 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
        closeModal();
      }
    });
    
    if (tabLoginBtn && tabSignupBtn) {
      tabLoginBtn.addEventListener('click', () => switchTab('login'));
      tabSignupBtn.addEventListener('click', () => switchTab('signup'));
    }
    
    // 폼 제출 핸들링
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const studentId = document.getElementById('studentId').value;
        
        if (currentTab === 'login') {
          alert(`반갑습니다, 학번 ${studentId}님! 로그인이 완료되었습니다.`);
          closeModal();
        } else {
          const studentName = studentNameInput.value;
          const agree = privacyAgreeCheckbox.checked;
          if (!agree) {
            alert('개인정보 동의에 체크해주셔야 회원가입이 가능합니다.');
            return;
          }
          alert(`학번 ${studentId} ${studentName}님, 회원가입이 성공적으로 완료되었습니다. 이제 로그인할 수 있습니다.`);
          switchTab('login');
        }
      });
    }
    // ===== 재고 확인 페이지 검색 및 필터 기능 =====
    const inventorySearch = document.getElementById('inventorySearch');
    const inventoryFilter = document.getElementById('inventoryFilter');
    const inventoryCards = document.querySelectorAll('.inventory_card');
    const noResult = document.getElementById('noResult');
    
    function filterInventory() {
      if (!inventorySearch || !inventoryFilter) return;
      
      const searchTerm = inventorySearch.value.toLowerCase().trim();
      const selectedCategory = inventoryFilter.value;
      let visibleCount = 0;
      
      inventoryCards.forEach(card => {
        const itemName = card.querySelector('.inv_item_name').textContent.toLowerCase();
        const cardCategory = card.getAttribute('data-category');
        
        const matchesSearch = itemName.includes(searchTerm);
        const matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory);
        
        if (matchesSearch && matchesCategory) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      if (noResult) {
        noResult.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }
    
    if (inventorySearch) {
      inventorySearch.addEventListener('input', filterInventory);
    }
    if (inventoryFilter) {
      inventoryFilter.addEventListener('change', filterInventory);
    }
    // ===== 리뷰 페이지 기능 =====
    const reviewFilter = document.getElementById('reviewFilter');
    const reviewList = document.getElementById('reviewList');
    const noReviewResult = document.getElementById('noReviewResult');
    
    // 필터링 기능
    if (reviewFilter && reviewList) {
      reviewFilter.addEventListener('change', () => {
        const selected = reviewFilter.value;
        const cards = reviewList.querySelectorAll('.review_card');
        let count = 0;
        
        cards.forEach(card => {
          if (selected === 'all' || card.dataset.category === selected) {
            card.style.display = 'block';
            count++;
          } else {
            card.style.display = 'none';
          }
        });
        
        if (noReviewResult) {
          noReviewResult.style.display = count === 0 ? 'block' : 'none';
        }
      });
      
      // 카드 토글 기능 (이벤트 위임)
      reviewList.addEventListener('click', (e) => {
        const card = e.target.closest('.review_card');
        if (card) {
          card.classList.toggle('expanded');
        }
      });
    }

    // 글쓰기 모달 기능
    const writePostBtn = document.getElementById('writePostBtn');
    const writeModal = document.getElementById('writeModal');
    const writeModalCloseBtn = document.getElementById('writeModalCloseBtn');
    const writeForm = document.getElementById('writeForm');
    
    function openWriteModal() {
      if (!writeModal) return;
      writeModal.classList.add('active');
      writeModal.setAttribute('aria-hidden', 'false');
    }
    
    function closeWriteModal() {
      if (!writeModal) return;
      writeModal.classList.remove('active');
      writeModal.setAttribute('aria-hidden', 'true');
      if (writeForm) writeForm.reset();
    }
    
    if (writePostBtn) writePostBtn.addEventListener('click', openWriteModal);
    if (writeModalCloseBtn) writeModalCloseBtn.addEventListener('click', closeWriteModal);
    
    if (writeModal) {
      writeModal.addEventListener('click', (e) => {
        if (e.target === writeModal) closeWriteModal();
      });
    }
    
    // 새 글 등록 처리
    if (writeForm && reviewList) {
      writeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const categoryVal = document.getElementById('postCategory').value;
        const titleVal = document.getElementById('postTitle').value;
        const contentVal = document.getElementById('postContent').value;
        
        const categoryNameMap = {
          'review': '리뷰',
          'suggestion': '매점건의사항',
          'request': '제품 추가요청',
          'other': '기타'
        };
        
        const categoryClassMap = {
          'review': 'badge_review',
          'suggestion': 'badge_suggestion',
          'request': 'badge_request',
          'other': 'badge_other'
        };
        
        const dateObj = new Date();
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2,'0')}.${String(dateObj.getDate()).padStart(2,'0')}`;
        
        const newCard = document.createElement('div');
        newCard.className = 'review_card';
        newCard.setAttribute('data-category', categoryVal);
        
        newCard.innerHTML = `
            <div class="review_header">
                <span class="review_category ${categoryClassMap[categoryVal]}">${categoryNameMap[categoryVal]}</span>
                <h4 class="review_title"></h4>
                <span class="review_date">${dateStr}</span>
            </div>
            <div class="review_body">
                <p></p>
            </div>
        `;
        
        newCard.querySelector('.review_title').textContent = titleVal;
        
        const pTag = newCard.querySelector('.review_body p');
        const lines = contentVal.split('\n');
        pTag.innerHTML = '';
        lines.forEach((line, idx) => {
            pTag.appendChild(document.createTextNode(line));
            if (idx < lines.length - 1) pTag.appendChild(document.createElement('br'));
        });
        
        reviewList.prepend(newCard);
        
        if (reviewFilter && reviewFilter.value !== 'all' && reviewFilter.value !== categoryVal) {
          newCard.style.display = 'none';
        }
        if (noReviewResult) noReviewResult.style.display = 'none';
        
        alert('글이 성공적으로 등록되었습니다.');
        closeWriteModal();
      });
    }
    // ===== 리뷰 페이지 (review.html) 제품 리뷰 전용 기능 =====
    const productListView = document.getElementById('productListView');
    const reviewDetailView = document.getElementById('reviewDetailView');
    const productReviewGrid = document.getElementById('productReviewGrid');
    const productSortFilter = document.getElementById('productSortFilter');
    const detailProductName = document.getElementById('detailProductName');
    const detailReviewCount = document.getElementById('detailReviewCount');
    const detailUpvoteCount = document.getElementById('detailUpvoteCount');
    const detailReviewList = document.getElementById('detailReviewList');
    const noDetailReview = document.getElementById('noDetailReview');
    const backToProductsBtn = document.getElementById('backToProductsBtn');
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    
    let currentProductName = '';
    let currentProductCard = null;

    if (productListView && reviewDetailView) {
      // 정렬 기능
      if (productSortFilter && productReviewGrid) {
        productSortFilter.addEventListener('change', () => {
          const sortType = productSortFilter.value;
          const cards = Array.from(productReviewGrid.querySelectorAll('.product_review_card'));
          
          cards.sort((a, b) => {
            if (sortType === 'reviews') {
              return parseInt(b.dataset.reviews) - parseInt(a.dataset.reviews);
            } else if (sortType === 'upvotes') {
              return parseInt(b.dataset.upvotes) - parseInt(a.dataset.upvotes);
            }
            // default: DOM 순서 (여기서는 재정렬을 위해 처음 상태를 저장해두는게 좋지만 단순화함)
            return 0; 
          });
          
          productReviewGrid.innerHTML = '';
          cards.forEach(card => productReviewGrid.appendChild(card));
        });
      }

      // 제품 카드 클릭 -> 상세 리뷰 화면으로 전환
      if (productReviewGrid) {
        productReviewGrid.addEventListener('click', (e) => {
          const card = e.target.closest('.product_review_card');
          if (!card) return;
          
          currentProductCard = card;
          currentProductName = card.dataset.name;
          const reviewCount = card.dataset.reviews;
          const upvoteCount = card.dataset.upvotes;
          
          detailProductName.textContent = currentProductName;
          detailReviewCount.textContent = reviewCount;
          detailUpvoteCount.textContent = upvoteCount;
          
          // 화면 전환
          productListView.style.display = 'none';
          reviewDetailView.style.display = 'block';
          writeReviewBtn.style.display = 'flex';
          
          // 더미 리뷰 생성
          generateDummyReviews(currentProductName, parseInt(reviewCount));
        });
      }

      // 뒤로 가기
      if (backToProductsBtn) {
        backToProductsBtn.addEventListener('click', () => {
          reviewDetailView.style.display = 'none';
          writeReviewBtn.style.display = 'none';
          productListView.style.display = 'block';
          currentProductName = '';
          currentProductCard = null;
        });
      }
      
      // 추천 버튼 클릭 로직 (이벤트 위임)
      detailReviewList.addEventListener('click', (e) => {
        const upvoteBtn = e.target.closest('.upvote_btn');
        if (!upvoteBtn) return;
        
        const countSpan = upvoteBtn.querySelector('.upvote_count');
        let count = parseInt(countSpan.textContent);
        
        if (upvoteBtn.classList.contains('active')) {
          upvoteBtn.classList.remove('active');
          count--;
          // 전체 제품 추천 수도 감소
          if (currentProductCard) {
            let totalUp = parseInt(currentProductCard.dataset.upvotes);
            currentProductCard.dataset.upvotes = totalUp - 1;
            currentProductCard.querySelector('.stat_val:last-child').textContent = totalUp - 1;
            detailUpvoteCount.textContent = totalUp - 1;
          }
        } else {
          upvoteBtn.classList.add('active');
          count++;
          // 전체 제품 추천 수 증가
          if (currentProductCard) {
            let totalUp = parseInt(currentProductCard.dataset.upvotes);
            currentProductCard.dataset.upvotes = totalUp + 1;
            currentProductCard.querySelector('.stat_val:last-child').textContent = totalUp + 1;
            detailUpvoteCount.textContent = totalUp + 1;
          }
        }
        countSpan.textContent = count;
      });
      
      // 제품별 고유 더미 리뷰 데이터 (요청된 세 가지 밈 리뷰로 고정)
      const genericDummyReviews = [
          { title: '리뷰', content: '[상품명]을 변기에 넣고서 내려', upvotes: 2 },
          { title: '리뷰', content: '[상품명]이 맛있어요', upvotes: 1 },
          { title: '리뷰', content: '[상품명]에게 잡아먹힐것 같아', upvotes: 3 },
      ];

      function generateDummyReviews(productName, count) {
        detailReviewList.innerHTML = '';
        if (count === 0) {
          noDetailReview.style.display = 'block';
          return;
        }
        noDetailReview.style.display = 'none';

        const reviews = genericDummyReviews; // 어떤 제품이든 고정된 세 개의 리뷰 사용
        const dateObj = new Date();
        const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2,'0')}.${String(dateObj.getDate()).padStart(2,'0')}`;

        // 요청한 리뷰 개수만큼 자르거나, 데이터가 부족하면 있는 만큼만 반복 (여기서는 고정 3개이므로 count에 맞춰 조정 가능. 단, 요구사항이 "이 세가지 더미리뷰만 띄워줘" 였으므로 전부 표시)
        reviews.slice(0, Math.max(count, 3)).forEach(rv => {
          const newCard = document.createElement('div');
          newCard.className = 'review_card';
          newCard.addEventListener('click', (e) => {
            if (!e.target.closest('.upvote_btn')) newCard.classList.toggle('expanded');
          });
          newCard.innerHTML = `
            <div class="review_header">
              <span class="review_category badge_review">리뷰</span>
              <h4 class="review_title"></h4>
              <span class="review_date">${dateStr}</span>
            </div>
            <div class="review_body"><p></p></div>
            <div class="review_card_footer">
              <button class="upvote_btn">
                <img src="icons8-g.png" class="upvote_icon" alt="추천">
                추천 <span class="upvote_count">${rv.upvotes}</span>
              </button>
            </div>
          `;
          
          // [상품명] 플레이스홀더를 실제 제품명으로 치환
          const replacedTitle = rv.title.replace(/\[상품명\]/g, productName);
          const replacedContent = rv.content.replace(/\[상품명\]/g, productName);

          newCard.querySelector('.review_title').textContent = replacedTitle;
          newCard.querySelector('.review_body p').textContent = replacedContent;
          detailReviewList.appendChild(newCard);
        });
      }
    }

    // 리뷰 전용 글쓰기 모달
    const writeReviewModal = document.getElementById('writeReviewModal');
    const writeReviewModalCloseBtn = document.getElementById('writeReviewModalCloseBtn');
    const writeReviewForm = document.getElementById('writeReviewForm');
    
    if (writeReviewBtn && writeReviewModal) {
      writeReviewBtn.addEventListener('click', () => {
        writeReviewModal.classList.add('active');
        writeReviewModal.setAttribute('aria-hidden', 'false');
      });
      
      const closeRevModal = () => {
        writeReviewModal.classList.remove('active');
        writeReviewModal.setAttribute('aria-hidden', 'true');
        if (writeReviewForm) writeReviewForm.reset();
      };
      
      if (writeReviewModalCloseBtn) writeReviewModalCloseBtn.addEventListener('click', closeRevModal);
      writeReviewModal.addEventListener('click', (e) => {
        if (e.target === writeReviewModal) closeRevModal();
      });
      
      // 리뷰 등록
      if (writeReviewForm) {
        writeReviewForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const titleVal = document.getElementById('reviewTitle').value;
          const contentVal = document.getElementById('reviewContent').value;
          const dateObj = new Date();
          const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth()+1).padStart(2,'0')}.${String(dateObj.getDate()).padStart(2,'0')}`;
          
          const newCard = document.createElement('div');
          newCard.className = 'review_card';
          newCard.addEventListener('click', (e) => {
             if(!e.target.closest('.upvote_btn')) {
               newCard.classList.toggle('expanded');
             }
          });
          
          newCard.innerHTML = `
              <div class="review_header">
                  <span class="review_category badge_review">리뷰</span>
                  <h4 class="review_title"></h4>
                  <span class="review_date">${dateStr}</span>
              </div>
              <div class="review_body">
                  <p></p>
              </div>
              <div class="review_card_footer">
                  <button class="upvote_btn">
                      <img src="icons8-g.png" class="upvote_icon" alt="추천">
                      추천 <span class="upvote_count">0</span>
                  </button>
              </div>
          `;
          
          newCard.querySelector('.review_title').textContent = titleVal;
          const pTag = newCard.querySelector('.review_body p');
          const lines = contentVal.split('\n');
          pTag.innerHTML = '';
          lines.forEach((line, idx) => {
              pTag.appendChild(document.createTextNode(line));
              if (idx < lines.length - 1) pTag.appendChild(document.createElement('br'));
          });
          
          detailReviewList.prepend(newCard);
          noDetailReview.style.display = 'none';
          
          // 리뷰 수 증가
          if (currentProductCard) {
            let totalRev = parseInt(currentProductCard.dataset.reviews);
            currentProductCard.dataset.reviews = totalRev + 1;
            currentProductCard.querySelectorAll('.stat_val')[0].textContent = totalRev + 1;
            detailReviewCount.textContent = totalRev + 1;
          }
          
          alert('리뷰가 성공적으로 등록되었습니다.');
          closeRevModal();
        });
      }
    }
  })();
});
<!-- # project
## 주제 : 온라인 매점 서비스

- 기능
1. 매점 재고 확인
2. 매점 물건 구매 건의
3. 아리소리 페이 확인
4. 로그인(학생 본인 확인)
5. 물건 리뷰
---
    
- 도메인
1. student 
 - studentid(학반번호)
 - name(이름)
 - grade(학년)
 - class_num(반)
 - number(번호)
 - password(로그인 비밀번호)
 - balance(아리소리페이 잔액)

2. product 
 - productid(상품 번호)
 - productname(상품명)
 - price(가격)
 - stock(재고)

3. review
 - reviewid(리뷰 번호)
 - studentid(작성학생 학반번호)
 - productid(상품 번호)
 - content(리뷰 내용)

4. suggestion
 - suggestionid(건의 번호)
 - studentid(건의학생 학반번호)
 - productname(판매 요청 상품명)
 - content(요청 내용)


---

- 페이지
1. 시작화면 (로그인)
2. 매점 재고 확인
3. 매점 물건 구매 건의창
4. 리뷰창
5. 아리소리페이 확인
---

 -->





# Project

## 주제 : 온라인 매점 서비스

### 기능

1. 매점 재고 확인
2. 매점 물건 구매 건의
3. 아리소리페이 확인
4. 로그인(학생 본인 확인)
5. 물건 리뷰

---

## 도메인

### 1. Student

| 속성명 | 설명 |
|---------|---------|
| studentid | 학년, 반, 번호를 조합한 학생 식별번호 |
| name | 학생 이름 |
| grade | 학생 학년 |
| class_num | 학생 반 |
| number | 학생 번호 |
| password | 로그인 비밀번호 |
| balance | 아리소리페이 잔액 |

---

### 2. Product

| 속성명 | 설명 |
|---------|---------|
| productid | 상품 번호 |
| productname | 상품명 |
| price | 상품 가격 |
| stock | 상품 재고 수량 |

---

### 3. Review

| 속성명 | 설명 |
|---------|---------|
| reviewid | 리뷰 번호 |
| studentid | 리뷰를 작성한 학생의 식별번호 |
| productid | 리뷰 대상 상품 번호 |
| content | 리뷰 내용 |

---

### 4. Suggestion

| 속성명 | 설명 |
|---------|---------|
| suggestionid | 건의 번호 |
| studentid | 건의를 작성한 학생의 식별번호 |
| productname | 판매를 요청하는 상품명 |
| content | 건의 내용 |

---

## 사용 테이블

1. student
2. product
3. review
4. suggestion

---

## 데이터베이스 관계

- review.studentid → student.studentid
- review.productid → product.productid
- suggestion.studentid → student.studentid

---

## 페이지

### 1. 시작화면 (로그인)

- 학생의 학생 식별번호(studentid)와 비밀번호를 입력하여 로그인한다.
- 로그인 성공 시 메인 화면으로 이동한다.

### 2. 매점 재고 확인

- 현재 매점에서 판매 중인 상품을 확인한다.
- 상품명, 가격, 재고 수량을 조회할 수 있다.

### 3. 매점 물건 구매 건의창

- 학생이 판매를 원하는 상품을 건의한다.
- 상품명과 건의 내용을 작성하여 제출할 수 있다.

### 4. 리뷰창

- 학생이 상품에 대한 후기를 작성한다.
- 작성된 리뷰를 조회할 수 있다.

### 5. 아리소리페이 확인

- 학생의 현재 아리소리페이 잔액을 확인한다.
# Project

## 주제 : 온라인 매점 서비스

학교 매점의 재고를 확인하고, 학생들이 원하는 상품을 건의하며, 상품에 대한 리뷰를 작성할 수 있는 온라인 매점 서비스

학생 본인 확인을 위한 로그인 기능과 아리소리페이 잔액 확인 기능 제공

---

## 주요 기능

1. 로그인 (학생 본인 확인)
2. 매점 재고 확인
3. 매점 물건 구매 건의
4. 물건 리뷰 작성 및 조회
5. 아리소리페이 잔액 확인

---

## 사용 테이블

1. student
2. product
3. review
4. suggestion

---

## 데이터베이스 설계

### 1. Student

학생 정보와 로그인 정보를 저장하는 테이블

| 속성명       | 설명        |
| --------- | --------- |
| studentid | 학생 식별번호 (학년 반 번호)   |
| name      | 학생 이름     |
| grade     | 학생 학년     |
| class_num | 학생 반      |
| number    | 학생 번호     |
| password  | 로그인 비밀번호  |
| balance   | 아리소리페이 잔액 |

---

### 2. Product

매점 상품 정보를 저장하는 테이블

| 속성명         | 설명    |
| ----------- | ----- |
| productid   | 상품 번호 |
| productname | 상품명   |
| price       | 상품 가격 |
| stock       | 재고 수량 |

---

### 3. Review

학생이 작성한 상품 리뷰를 저장하는 테이블

| 속성명       | 설명       |
| --------- | -------- |
| reviewid  | 리뷰 번호    |
| studentid | 리뷰 작성 학생 식별번호 (학년 반 번호)|
| productid | 리뷰 대상 상품 |
| content   | 리뷰 내용    |

---

### 4. Suggestion

학생의 상품 판매 요청을 저장하는 테이블

| 속성명          | 설명        |
| ------------ | --------- |
| suggestionid | 건의 번호     |
| studentid    | 건의 작성 학생 식별번호 (학년 반 번호)|
| productname  | 판매 요청 상품명 |
| content      | 건의 내용     |


---

## 데이터베이스 관계

### Primary Key (기본 키)

* student.studentid
* product.productid
* review.reviewid
* suggestion.suggestionid

### Foreign Key (왜래 키)

* review.studentid → student.studentid
* review.productid → product.productid
* suggestion.studentid → student.studentid

---

## 기능 구현 예시 SQL

### 로그인

```sql
select *
from student
where studentid = 3101
and password = '1234';
```

### 매점 재고 조회

```sql
select productname, price, stock
from product;
```

### 특정 상품 리뷰 조회

```sql
select content
from review
where productid = 1;
```

### 상품 건의 등록

```sql
insert into suggestion
values (1, 3101, '초코우유', '초코우유를 판매해주세요.');
```

### 아리소리페이 잔액 조회

```sql
select balance
from student
where studentid = 3101;
```

---

## 역할

### DB 설계

* 테이블 설계
* 기본키(Primary Key) 설정
* 외래키(Foreign Key) 설정
* 기능 구현에 필요한 데이터 구조 설계

---

## 페이지
 
### 1. 메인화면
 
- 학생의 학생 식별번호(studentid)와 비밀번호를 입력하여 로그인한다.
- 다크/라이트 모드를 토글할 수 있다.
- 학생의 매점 구매 통계(구매한 물품 종류, 이번달 총 구매액)를 확인할 수 있다.
- 다른 매점 서비스로 이동할 수 있다.
 
### 2. 매점 재고 확인
 
- 현재 매점에서 판매 중인 상품을 확인한다.
- 상품명, 가격, 재고 수량을 조회할 수 있다.
 
### 3. 매점 물건 구매 건의창
 
- 학생이 판매를 원하는 상품을 건의한다.
- 판매를 원하는 상품명과 건의 내용을 작성하여 제출할 수 있다.
- 매점 운영에 대한 기타 건의사항을 제출 할 수 있다.
 
### 4. 리뷰창
 
- 학생이 상품에 대한 후기를 작성한다.
- 작성된 리뷰를 조회할 수 있다.
 
### 5. 아리소리페이 확인
 
- 학생의 현재 아리소리페이 잔액을 확인한다.
- 아리소리페이의 공지사항을 확인할 수 있다.

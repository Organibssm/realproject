-- 1. student (grade, class_num, number, total, name, password)
-- 2. product (prodname, price, count)
-- 3. point (name, points, spent)
-- 4. review (name, prodname, content)
-- 5. suggestion (name, prodname, content)
-- 6. payhistory (name, prodname, pay, paydate)


create table student(
    grade int,
    class_num int,
    number int,
    total int,
    name varchar(4), 
    password varchar(14)
);
create table product(
	prodname varchar(30),
    price int,
    count int
);
create table point(
	name varchar(4),
    points int,
    spent int
);
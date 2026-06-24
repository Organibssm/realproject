create table student(
    studentid int,
    name varchar(10),
    grade int,
    class_num int,
    number int,
    password varchar(14),
    balance int,
    primary key(studentid)
);

create table product(
    productid int,
    productname varchar(30),
    price int,
    stock int,
    primary key(productid)
);

create table review(
    reviewid int,
    studentid int,
    productid int,
    content varchar(200),
    primary key(reviewid),
    foreign key(studentid)
        references student(studentid),
    foreign key(productid)
        references product(productid)
);

create table suggestion(
    suggestionid int,
    studentid int,
    productname varchar(30),
    content varchar(200),
    primary key(suggestionid),
    foreign key(studentid)
        references student(studentid)
);
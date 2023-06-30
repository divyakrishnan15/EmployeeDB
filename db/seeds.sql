INSERT INTO department(dept_id,name) 
VALUES( 01,'ACCOUNTING' ),
    ( 02,'RESEARCH' ),
    ( 03,'MARKETING' );

INSERT INTO role(role_id,title,salary,department_id) 
VALUES( 101,'CEO','90000',01 ),
    ( 102,'MANAGER','90000',01 ),
    ( 103,'LEAD','50000',01 ),
    ( 104,'SALESMAN','80000',03 ),
    ( 105,'ANALYST','80000',02 ),
    ( 106,'CASHIER','80000',03 );

INSERT INTO employee(emp_id,first_name,last_name,role_id,manager_id) 
VALUES( 1001,'John','Connor',101,1001 ),
    ( 1002,'James','Smith',102,1001 ),
    ( 1003,'Emily','Rose',103,1002 ),
    ( 1004,'Jessica','Turner',104,1003 ),
    ( 1005,'Henry','Axel',105,1003 ),
    ( 1006,'Peter','Parker',105,1003 ),
    ( 1007,'Ruby','Leo',106,1003 );


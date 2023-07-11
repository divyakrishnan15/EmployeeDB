INSERT INTO department(name) 
VALUES( 'ACCOUNTING' ),
    ( 'RESEARCH' ),
    ( 'MARKETING' ),
    ( 'SALES' ),
    ( 'PURCHASING' );

INSERT INTO role(title,salary,department_id) 
VALUES( 'CEO',200000,1 ),
    ( 'MANAGER',120000,1 ),
    ( 'LEAD',100000,1 ),
    ( 'ANALYST',90000,2 ),
    ( 'SALESMAN',80000,3 ),
    ( 'CASHIER',70000,3 ),
    ( 'OFFICER',60000,3 );

INSERT INTO employee(first_name,last_name,role_id,manager_id) 
VALUES( 'John','Connor',101,1001 ),
    ( 'Henry','Axel',102,1001 ),
    ( 'Emily','Rose',103,1002 ),
    ( 'James','Smith',104,1003 ),
    ( 'Jessica','Turner',104,1003 ),
    ( 'Will','Smith',102,1001 ),
    ( 'Peter','Parker',105,1006 ),
    ( 'Ruby','Leo',106,1006 ),
    ( 'Laura','Brian',107,1009 );


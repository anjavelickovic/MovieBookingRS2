# Movie Tickets Booking

Movie Tickets Booking is a microservice application for reserving tickets for movies.

## Required software

* .NET 5
* Angular 14
* Docker

## Running the application

1. Create file `docker-compose.env` with the following format:

```
OMDB_API_KEY=your_omdb_api_key
IMDB_API_KEY=your_imdb_api_key
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_ROOT_PASSWORD=your_mysql_root_password
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
MSSQL_USER=your_mssql_user
MSSQL_PASSWORD=your_mssql_password
PGADMIN_MAIL=your_pgadmin_mail
PGADMIN_PASSWORD=your_pgadmin_password
```

Place it in the MovieBooking directory and insert your data.

2. Position terminal in MovieBooking directory and run next command:

``` 
docker-compose --env-file=./docker-compose.env -f docker-compose.yml -f docker-compose.override.yml up -d --build 
``` 
 
3. Position terminal in MovieBookingSPA directory and run next commands:
``` 
npm i
ng serve
``` 

## Services

### Movies

### Discount
  Discount microservice stores coupons for movie ticket discounts. Only Administrators can create, update or delete coupons. 
  Using the gRPC Discount microservice sends this coupon information to Reservations microservice.
  
  The database used for this microservice is *PostgreSQL*.

  To create the database follow the instructions:
   1. Login to pgadmin at https://localhost:5050/
   2. Add a new Server with the following characteristics:
    - General:
      - Name: DiscountServer
    - Connection:
      - Host name/address: discountdb
      - Port: 5432 
      - Maintenance database: postgres 
      - Username: your_postgres_user 
      - Password: your_postgres_password
   3. Query tool
      ```
      CREATE TABLE Coupon (
        ID SERIAL PRIMARY KEY NOT NULL,
        MovieID VARCHAR(200),
        MovieName VARCHAR(200),
        Amount INTEGER, 
        CreationDate DATE,
        ModifiedDate DATE
       );
      ```


### Administration
 Administration microservice permanently saves previous reservation data.
 This service communicates with Reservations microservice when User officialy confirm that he has finished online ticket booking.

 Database that is used for this microservice is MSSQL.
 
  

## Authors

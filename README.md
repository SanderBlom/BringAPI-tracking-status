# BringAPI-tracking-status
Basic example on how to update a database with tracking id from bring/posten using NodeJS and Postgress. 

in this example you will need a postgress database with one table containing a column with tracking numbers with the name tracking.

Run this querry to generate the table: 

-- Table: public.status

-- DROP TABLE public.status;

CREATE TABLE public.status
(
    name character varying(30) COLLATE pg_catalog."default",
    tracking character varying(40) COLLATE pg_catalog."default" NOT NULL,
    status boolean,
    CONSTRAINT status_pkey PRIMARY KEY (tracking)
)

TABLESPACE pg_default;

ALTER TABLE public.status
    OWNER to postgres;


Change the database properties in the .env file to connect to it 

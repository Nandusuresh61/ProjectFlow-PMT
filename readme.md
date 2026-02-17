PROJECT PROGRESS SUMMARY 
-----------------------
 Architecture

Chosen Clean Architecture

Split project into:

Presentation

Application

Infrastructure

Shared

Followed dependency flow inward

No framework code in business logic


   Shared Package
------------------------------

Created a shared package for common things

Added:

Error codes

HTTP status codes

AppError

Auth error messages

Email messages & subjects

Email enums (OTP, RESET, INVITE)

Zod schemas

No business logic in shared


 Authentication (Core)
-----------------------

Started with Auth module

Designed OTP-based registration

Email + password + OTP verification

 Application Layer

Created use cases:

Start register

Verify OTP

Register user

Defined interfaces for:

User repository

Password hasher

OTP generator

OTP store (Redis)

Email service

Business logic stays framework-free

 Infrastructure Layer

Implemented:

MongoDB user repository

Redis OTP store

Password hashing

OTP generator

Token & UID services

Added Nodemailer email service

Email config handled via .env

OTP Email Flow
--------------------

Generate OTP

Hash OTP

Store OTP in Redis with TTL

Send OTP via email

Removed OTP console logging

Email logic is reusable

 Dependency Injection
-------------------------

DI container placed in presentation layer

Wired:

Infrastructure → Use cases

Use cases → Controllers

Use cases depend only on interfaces


 Presentation Layer
---------------------------

Auth controller implemented

Zod validation used

Async error handler added

Controllers contain no business logic

 Security Handling
---------------------

Password & OTP hashing

OTP expiry (TTL)

Max 3 OTP attempts

OTP deleted on success or abuse

Protection against brute-force attacks

 Current Status
-----------------

OTP-based registration is complete

Email system is production-ready

Architecture is clean & scalable

Ready to add:

Resend OTP

Reset password

Tests
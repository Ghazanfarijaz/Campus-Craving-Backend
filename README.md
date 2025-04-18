# Campus-Craving-Backend

Crux of Authentication & Authorization for Campus Cravings
Based on the project documentation, here's the essential information you'll need to build the authentication and authorization system from scratch:

Core Entities Involved
Users (with roles):

Students/Customers

Delivery Personnel

Restaurant Staff

System Administrators

Universities (for domain validation)

Restaurants (for staff permissions)

Authentication Flow

1. Registration Process
   User selects their university from dropdown

Enters university email address

System validates email domain against whitelisted university domains

Verification email sent to university email

User clicks verification link to activate account

User completes profile setup (name, phone, addresses, payment methods)

2. Login Process
   User enters university email and password

System verifies:

Email belongs to approved university domain

Account is verified (completed email verification)

Credentials are correct

JWT token issued upon successful authentication

Authorization Structure
Role-Based Access Control (RBAC):
Student/Customer:

Access to customer app features

Can browse, order, track deliveries

Limited to their university's restaurants

Delivery Personnel:

Access to delivery app

Can view/accept orders within their university

Must have completed 1099 documentation

Restaurant Staff:

Access to restaurant dashboard

Only for their specific restaurant

Can manage menus and orders

System Administrators:

Full access to admin dashboard

Can manage all entities in system

Requires MFA

Key Technical Requirements

1. University Email Validation
   Domain whitelisting per university

Real-time verification during registration

Prevention of non-university emails

2. Secure Authentication
   JWT implementation with refresh tokens

Password hashing (bcrypt recommended)

Session management

Rate limiting to prevent brute force attacks

3. Data Security
   Encryption of sensitive data (PII, payment info)

Secure token storage

Protection against common vulnerabilities (XSS, CSRF, SQL injection)

4. Compliance
   1099 contractor documentation for delivery personnel

GDPR/CCPA compliance for data handling

PCI compliance for payment processing

Database Schema Highlights (for Auth)
Key tables from the ERD relevant to authentication:

users: Stores all user credentials and roles

universities: Whitelisted domains for validation

restaurant_users: Junction table for restaurant staff permissions

delivery_persons: Additional data for delivery personnel

payment_methods: Securely stored payment info

Implementation Recommendations
Authentication Service:

Separate microservice for auth logic

JWT issuance and validation

Token refresh mechanism

University Email Verification:

Real-time domain validation

Verification email flow

Grace period for unverified accounts

Role Management:

Middleware for route protection

Permission checks at API level

Admin interfaces for role assignment

Security Measures:

HTTPS everywhere

Secure cookie settings

CSP headers

Regular security audits

Flow Summary
User attempts to register → System validates university email → Sends verification

User verifies email → Completes profile → Account activated

User logs in → Credentials validated → JWT issued

User makes request → JWT validated → Role checked → Access granted/denied

Token expires → Refresh token used to get new JWT

Special Considerations
Delivery Personnel Onboarding:

Additional verification step for 1099 compliance

Document upload and approval process

Restaurant Staff Assignment:

Restaurant admins can assign staff

Staff limited to their restaurant's data

Admin Privileges:

Highest level of access control

Audit logs for sensitive operations

MFA required

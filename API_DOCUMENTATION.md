# API Documentation

Complete API documentation with curl examples and Postman-ready payloads.

**Base URL**: `http://localhost:3000`

**Authentication**: Most endpoints require a JWT Bearer token in the Authorization header.

---

## 🔐 Authentication Endpoints

### 1. Login

Authenticate a user and receive access + refresh tokens.

**Endpoint**: `POST /auth/login`  
**Authentication**: Not required  
**Authorization**: None

**Request Body**:

```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "password123"
  }'
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "doctor@example.com",
    "role": "Doctor",
    "permissions": ["read:prescriptions", "write:prescriptions", ...]
  }
}
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

---

### 2. Refresh Token

Refresh access token using refresh token (token rotation).

**Endpoint**: `POST /auth/refresh`  
**Authentication**: Not required  
**Authorization**: None

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/auth/refresh`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

---

### 3. Logout

Logout user by blacklisting tokens.

**Endpoint**: `POST /auth/logout`  
**Authentication**: Required (Bearer token)  
**Authorization**: Any authenticated user

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Request Body** (optional):

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Response** (200 OK):

```json
{
  "message": "Successfully logged out"
}
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/auth/logout`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

---

### 4. Get Current User

Get information about the currently authenticated user.

**Endpoint**: `GET /auth/me`  
**Authentication**: Required (Bearer token)  
**Authorization**: Any authenticated user

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
{
  "id": 1,
  "email": "doctor@example.com",
  "role": "Doctor",
  "permissions": ["read:prescriptions", "write:prescriptions", ...]
}
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/auth/me`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

### 5. Machine-to-Machine Token

Generate access token for service-to-service communication.

**Endpoint**: `POST /auth/m2m/token`  
**Authentication**: Not required  
**Authorization**: None

**Request Body**:

```json
{
  "serviceId": "example-service",
  "serviceSecret": "example-secret"
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/auth/m2m/token \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "example-service",
    "serviceSecret": "example-secret"
  }'
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/auth/m2m/token`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "serviceId": "example-service",
  "serviceSecret": "example-secret"
}
```

---

### Signup

Register a new user as a Patient (default role).

**Endpoint**: `POST /auth/signup`  
**Authentication**: Not required  
**Authorization**: None

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "patient@example.com",
  "password": "password123"
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "patient@example.com",
    "password": "password123"
  }'
```

**Response** (201 Created):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "user": {
    "id": 2,
    "email": "patient@example.com",
    "role": "Patient",
    "permissions": ["read:prescriptions", "read:history", ...]
  }
}
```

---

## 👥 Users Endpoints

### 6. Create User

Create a new user.

**Endpoint**: `POST /users`  
**Authentication**: Required (Bearer token)  
**Authorization**: Doctor or Admin role + WRITE_USERS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Request Body**:

```json
{
  "email": "patient@example.com",
  "password": "password123",
  "role": "Patient",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "role": "Patient",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }'
```

**Response** (201 Created):

```json
{
  "id": 2,
  "email": "patient@example.com",
  "role": "Patient",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/users`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "patient@example.com",
  "password": "password123",
  "role": "Patient",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true
}
```

---

### 7. Get All Users

Get list of all users.

**Endpoint**: `GET /users`  
**Authentication**: Required (Bearer token)  
**Authorization**: READ_USERS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "email": "doctor@example.com",
    "role": "Doctor",
    "firstName": "Jane",
    "lastName": "Smith",
    "isActive": true
  },
  {
    "id": 2,
    "email": "patient@example.com",
    "role": "Patient",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }
]
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/users`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

### 8. Get User by ID

Get a specific user by ID.

**Endpoint**: `GET /users/:id`  
**Authentication**: Required (Bearer token)  
**Authorization**: READ_USERS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
{
  "id": 1,
  "email": "doctor@example.com",
  "role": "Doctor",
  "firstName": "Jane",
  "lastName": "Smith",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/users/1`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

## 💊 Prescriptions Endpoints

### 9. Create Prescription

Create a new prescription.

**Endpoint**: `POST /prescriptions`  
**Authentication**: Required (Bearer token)  
**Authorization**: Doctor or Admin role + WRITE_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Request Body**:

```json
{
  "doctorId": 1,
  "patientId": 2,
  "medication": "Aspirin",
  "dosage": "100mg",
  "frequency": "Once daily"
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/prescriptions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "patientId": 2,
    "medication": "Aspirin",
    "dosage": "100mg",
    "frequency": "Once daily"
  }'
```

**Response** (201 Created):

```json
{
  "id": 1,
  "doctor": {
    "id": 1,
    "email": "doctor@example.com"
  },
  "patient": {
    "id": 2,
    "email": "patient@example.com"
  },
  "medication": "Aspirin",
  "dosage": "100mg",
  "frequency": "Once daily",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/prescriptions`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "doctorId": 1,
  "patientId": 2,
  "medication": "Aspirin",
  "dosage": "100mg",
  "frequency": "Once daily"
}
```

---

### 10. Get All Prescriptions

Get list of all prescriptions.

**Endpoint**: `GET /prescriptions`  
**Authentication**: Required (Bearer token)  
**Authorization**: READ_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/prescriptions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "medication": "Aspirin",
    "dosage": "100mg",
    "frequency": "Once daily",
    "isActive": true
  }
]
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/prescriptions`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

### 11. Get Prescription by ID

Get a specific prescription by ID.

**Endpoint**: `GET /prescriptions/:id`  
**Authentication**: Required (Bearer token)  
**Authorization**: READ_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/prescriptions/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
{
  "id": 1,
  "medication": "Aspirin",
  "dosage": "100mg",
  "frequency": "Once daily",
  "isActive": true
}
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/prescriptions/1`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

### 12. Update Prescription

Update an existing prescription.

**Endpoint**: `PATCH /prescriptions/:id`  
**Authentication**: Required (Bearer token)  
**Authorization**: Doctor or Admin role + WRITE_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Request Body**:

```json
{
  "dosage": "200mg",
  "frequency": "Twice daily"
}
```

**cURL**:

```bash
curl -X PATCH http://localhost:3000/prescriptions/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "dosage": "200mg",
    "frequency": "Twice daily"
  }'
```

**Response** (200 OK):

```json
{
  "id": 1,
  "medication": "Aspirin",
  "dosage": "200mg",
  "frequency": "Twice daily",
  "isActive": true
}
```

**Postman**:

- Method: `PATCH`
- URL: `http://localhost:3000/prescriptions/1`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "dosage": "200mg",
  "frequency": "Twice daily"
}
```

---

### 13. Delete Prescription

Delete a prescription.

**Endpoint**: `DELETE /prescriptions/:id`  
**Authentication**: Required (Bearer token)  
**Authorization**: Doctor or Admin role + DELETE_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X DELETE http://localhost:3000/prescriptions/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```
(No content)
```

**Postman**:

- Method: `DELETE`
- URL: `http://localhost:3000/prescriptions/1`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

### 14. Get Prescription History

Get prescription history for a patient.

**Endpoint**: `GET /prescriptions/history/:patientId`  
**Authentication**: Required (Bearer token)  
**Authorization**: Patient, Doctor, or Admin role + READ_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/prescriptions/history/2 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "medication": "Aspirin",
    "dosage": "100mg",
    "frequency": "Once daily",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/prescriptions/history/2`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

## 🏥 Pharmacy Endpoints

### 15. Notify Pharmacy

Notify pharmacy about a prescription.

**Endpoint**: `POST /pharmacy/notify`  
**Authentication**: Required (Bearer token)  
**Authorization**: Pharmacy or Admin role + WRITE_NOTIFICATIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Request Body**:

```json
{
  "prescription": {
    "id": 1,
    "medication": "Aspirin",
    "dosage": "100mg"
  },
  "pharmacy": {
    "id": 1,
    "name": "Main Pharmacy",
    "address": "123 Main St"
  }
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/pharmacy/notify \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prescription": {
      "id": 1,
      "medication": "Aspirin",
      "dosage": "100mg"
    },
    "pharmacy": {
      "id": 1,
      "name": "Main Pharmacy",
      "address": "123 Main St"
    }
  }'
```

**Response** (200 OK):

```
(No content)
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/pharmacy/notify`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "prescription": {
    "id": 1,
    "medication": "Aspirin",
    "dosage": "100mg"
  },
  "pharmacy": {
    "id": 1,
    "name": "Main Pharmacy",
    "address": "123 Main St"
  }
}
```

---

### 16. Track Refill

Track prescription refill.

**Endpoint**: `POST /pharmacy/refill`  
**Authentication**: Required (Bearer token)  
**Authorization**: Pharmacy or Admin role + WRITE_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Request Body**:

```json
{
  "prescriptionId": "1",
  "quantity": 30,
  "refillDate": "2024-01-15T00:00:00.000Z"
}
```

**cURL**:

```bash
curl -X POST http://localhost:3000/pharmacy/refill \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "prescriptionId": "1",
    "quantity": 30,
    "refillDate": "2024-01-15T00:00:00.000Z"
  }'
```

**Response** (200 OK):

```
(No content)
```

**Postman**:

- Method: `POST`
- URL: `http://localhost:3000/pharmacy/refill`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
  - `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "prescriptionId": "1",
  "quantity": 30,
  "refillDate": "2024-01-15T00:00:00.000Z"
}
```

---

### 17. Get Active Prescriptions

Get active prescriptions for a pharmacy.

**Endpoint**: `GET /pharmacy/:pharmacyId/active-prescriptions`  
**Authentication**: Required (Bearer token)  
**Authorization**: Pharmacy or Admin role + READ_PRESCRIPTIONS permission

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/pharmacy/1/active-prescriptions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "medication": "Aspirin",
    "dosage": "100mg",
    "frequency": "Once daily",
    "isActive": true
  }
]
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/pharmacy/1/active-prescriptions`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

## 📜 History Endpoints

### 18. Get Prescription History

Get prescription history for a patient.

**Endpoint**: `GET /history/:patientId`  
**Authentication**: Required (Bearer token)  
**Authorization**: READ_HISTORY permission + Resource ownership (users can only access their own history)

**Request Headers**:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**cURL**:

```bash
curl -X GET http://localhost:3000/history/2 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "prescription": {
      "id": 1,
      "medication": "Aspirin"
    },
    "patient": {
      "id": 2,
      "email": "patient@example.com"
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/history/2`
- Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`

---

## 🔧 Health Check

### 19. Health Check

Basic health check endpoint.

**Endpoint**: `GET /`  
**Authentication**: Not required  
**Authorization**: None

**cURL**:

```bash
curl -X GET http://localhost:3000/
```

**Response** (200 OK):

```
Hello World!
```

**Postman**:

- Method: `GET`
- URL: `http://localhost:3000/`

---

## 📝 Error Responses

All endpoints return consistent error responses:

**401 Unauthorized** (Invalid/missing token):

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden** (Insufficient permissions):

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found"
}
```

**400 Bad Request** (Validation error):

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 🔑 Roles and Permissions

### Roles

- `admin` - Full system access
- `user` - Basic authenticated user
- `service` - Machine-to-machine service accounts
- `Doctor` - Healthcare provider
- `Patient` - Patient
- `Pharmacy` - Pharmacy service

### Common Permissions

- `read:users`, `write:users`, `delete:users`
- `read:prescriptions`, `write:prescriptions`, `delete:prescriptions`
- `read:pharmacy`, `write:pharmacy`
- `read:history`, `write:history`
- `read:notifications`, `write:notifications`

---

## 📋 Testing Workflow

1. **Login** to get access token:

   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"doctor@example.com","password":"password123"}'
   ```

2. **Copy the accessToken** from the response

3. **Use the token** in subsequent requests:

   ```bash
   curl -X GET http://localhost:3000/users \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
   ```

4. **Refresh token** when access token expires:
   ```bash
   curl -X POST http://localhost:3000/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
   ```

---

## 🚀 Postman Collection Setup

1. Create a new collection in Postman
2. Add a collection variable: `baseUrl` = `http://localhost:3000`
3. Add a collection variable: `accessToken` = (leave empty, will be set after login)
4. For authenticated requests, use: `Authorization: Bearer {{accessToken}}`
5. Create a pre-request script to automatically set the token after login

**Pre-request Script Example** (for login request):

```javascript
pm.test('Set access token', function () {
  var jsonData = pm.response.json();
  pm.collectionVariables.set('accessToken', jsonData.accessToken);
});
```

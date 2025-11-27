# Bitcoin Transaction System — Backend API
Backend service for the Bitcoin Transaction System portfolio project created for University of Texas at Dallas Database course.  
Provides user authentication, secure password handling, Bitcoin buy/sell logic, and persistent transaction storage using PostgreSQL.

This backend exposes REST API endpoints consumed by the React/Redux frontend.

---

## 🛠️ Tech Stack

- **Node.js**  
- **Express.js**  
- **PostgreSQL**  
- **Knex.js** (migrations & seeds)  
- **JWT** (JSON Web Tokens)  
- **bcrypt** (password hashing)  
- **Axios** (for internal requests if needed)

---

## 📁 Project Structure

 ```
bitcoin-transaction-system-be/
│── api/
│ ├── __tests__/
│ ├── auth/
│ ├── data/
│ ├── secrets/
│ ├── users/
│ └── server.js
│
├── knexfile.js
└── package.json
 ```
---

## 🔐 Authentication
The backend uses:

- **JWT** for authentication and protected routes  
- **bcrypt** for hashing passwords  
- Middleware that validates tokens for all `/api/users/*` routes  

---

## 🗄️ Database Schema

### User
user_id (PK)<br>
email <br>
password <br>
user_type
---
### Trader
trader_id (PK) <br>
first_name <br>
last_name <br>
phone_num <br>
cell_num <br>
email     (FK) <br>
city <br>
state <br>
street_addr <br>
zip_code <br>
USD_balance <br>
Bitcoin_balance <br>
transfer_balace
--
## Client
client_id   (PK) <br>
trader_id   (FK) <br>
first_name <br>
last_name <br>
phone_num <br>
cell_num <br>
email       (FK) <br>
city <br>
state <br>
street_addr <br>
zip_code <br>
USD_balance <br>
Bitcoin_balance <br>
mem_level <br>
num_trades 
---
## Order
order_id    (PK) <br>
client_id   (FK) <br>
date   <br>
comm_paid <br>
comm_type <br>
Bitcoin_balance <br>
isCancelled 
---
## Transfer
transac_id   (PK) <br>
client_id    (FK) <br>
trader_id    (FK) <br>
amount_paid <br>
date <br>
isCancelled <br>
isInvested
---
## Cancel_log
log_id       (PK) <br>
order_id     (FK) <br>
client_id    (FK) <br>
trader_id    (FK) <br>
transac_id <br>
date   <br>
comm_paid <br>
comm_type <br>
Bitcoin_balance <br>
amount_paid <br>
isCancelled <br>
isInvested <br>


Built and managed using **Knex migrations and seeds**.

---

## 🚀 Running the Backend

### 1. Install dependencies

npm install

### 2. Configure environment variables
example .env

PORT=5000
<br>
NODE_ENV = development
<br>
DATABASE_URL=postgres://your-db-url
<br>
TESTING_DATABASE_URL = postgres://your-db-url
<br>
DEV_DATABASE_URL = postgres://your-db-url
<br>
JWT_SECRET=your-secret-key
<br>
CMC_API_KEY = your api key to retrieve latest price of bitcoin from coin market cap


### 3. Run migrations / seeds
npm run migrate
npm run seed

### 4. Start the server
npm run server

## 🧪 API Endpoints (Backend)

### **Auth Routes**
| Method | Endpoint          | Description                |
|--------|-------------------|----------------------------|
| POST   | `/api/auth/signup`   | Register new user         |
| POST   | `/api/auth/login`    | Login & receive JWT token |

### **User: Client / Transaction Routes**
| Method | Endpoint                 | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | `/api/users/latest`            | Get current price of Bitcoin     |
| GET    | `/api/users/portfolio`         | Retrieves portfolio              |
| GET    | `/api/users/orders`            | Retrieves orders made by user    |
| POST   | `/api/users/buy-bitcoin`       | Buy bitcoin                      |
| POST   | `/api/users/sell-bitcoin`      | Sell bitcoin                     |
| GET    | `/api/users/bitcoin-wallet`    | Get user bitcoin wallet          |
| POST   | `/api/users/transfer-money`    | Transfer money to trader         |

### **User: Trader / Transaction Routes**
| Method | Endpoint                 | Description                                                 |
|--------|---------------------------|--------------------------------------------------------------|
| GET    | `/api/users/trader-portfolio`                | Retrieves portfolio                           |
| POST   | `/api/users/trader-buy-bitcoin`              | Buy bitcoin  (behalf of client)               |
| POST   | `/api/users/trader-sell-bitcoin`             | Sell bitcoin (behalf of client)               |
| POST   | `/api/users/clients/search`                  | Get client information                        |
| GET    | `/api/users/cancel-log`                      | Retrieves cancel log                          |
| GET    | `/api/users/clients/:client_id/transactions` | Retrieves orders made by clients              |
| GET    | `/api/users/clients/:client_id/payments`     | Retrieves money transfers made by clients     |
| PUT    | `/api/users/cancel-payment-or-transfer`      | Cancel order or money transfer made by client |

### **Secret User: Manager (limited Admin type): Manager Routes**
| Method | Endpoint                 | Description                      |
|--------|---------------------------|----------------------------------|
| POST   | `/api/users/daily`             | Get total number of daily transactions     |
| POST   | `/api/users/weekly`            | Get total number of weekly transactions    |
| POST   | `/api/users/monthly`           | Get total number of monthly                |




All `/api/users/*` routes require a valid JWT.

---

## 🤝 Notes for Recruiters

### This backend demonstrates:

Authentication & protected route design

Secure password handling with bcrypt

REST API structure and routing

PostgreSQL data modeling

Transaction workflow logic

Clean architecture with controllers, models, and middleware

Knex migrations and seeds

JSON Web Token flow

## This project reflects real-world backend development patterns.

### 📬 Contact

Stephen Aranda
**Email:** aranda.stephen88@gmail.com

**LinkedIn:** https://www.linkedin.com/in/stephen-aranda-9b9974205

---

### Bitcoin Transaction system README's

project-frontend/
   rev-bts/README.md                        <-- Full project overview
<br>
**Link:** https://github.com/OniWarrior/rev-bts

project-backend/
   bitcoin-transaction-system-be/README.md  <-- Backend-only details
<br>
**Link:** https://github.com/OniWarrior/bitcoin-transaction-system-be







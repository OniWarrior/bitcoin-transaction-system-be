# bitcoin-transaction-system-be
This is the back-end api for the bitcoin transaction system app
being developed for UTD Database management systems course.

# Description
This api contains the CRUD operations endpoints for the front end.

# auth endpoints
/Signup: The endpoint that performs the registration of a new account
With this endpoint, because a trader can't be assigned the endpoint, an arbitrary
choice was made to assign a new client account to a default trader that will not be stated
for security reasons. 

/Login: This endpoint posts the login of the user. Upon successful login a json web token
is assigned to the user.

# trader endpoints
/TraderBuyBitcoin: This endpoints performs the logic necessary to post a purchase
of Bitcoin on behalf of a client. All of the necessary logic to update the respective
accounts of the client and trader are performed in the CRUD OP.

/TraderSellBitcoin: This endpoint operates the same as TraderBuy. The only difference is that it post a sell of Bitcoin rather than a buy for the client in question. The logic to update accounts are also performed.

/clients/search: This endpoint receives the credentials entered by a trader trying to
perform a search for a specific client. It receives first name, last name, and email.
The main mechanism to make the search successful is the email because it is the unique credential that guarantees to find the client that is associated with this email if it exists.

/cancel-log: This endpoint retrieves the cancel log of the specific trader.

/clients/:client_id/transactions: This endpoints performs a retrieval of all transactions
made by the client or the trader on behalf of the client.

/clients:/:client_id/payments: This endpoint performs a retrieval of all payments
made by the client or the trader on behalf of the client.

/CancelPaymentOrTransaction: This endpoint performs a cancelation of a payment or transaction.

# client endpoints
/Orders: This retrieve all orders made by the client in the past

/BuyBitcoin: This will post an order for buying Bitcoin for the client.
This also performs identity validation logic and updates the clients
account.

/SellBitcoin: This will post an order for selling Bitcoin for the client
This performs the same identity validation logic as BuyBitcoin and updates the 
client's account.

/BitcoinWallet: This endpoint will retrieve the client's Bitcoin Wallet by using
their email credential.

/TransferMoney: This endpoint will post a transfer payment order for the client.
This order represents a transfer of USD from the client to their respective trader.

# Bitcoin endpoints
/latest: This endpoint is used by both the client and trader. This is a third party
API call from coinmarketcap. This fetches the current price of Bitcoin for the front end of the application.



# npm i
Go into the command line, cd into api, and type in the command npm i.
This command will install all the dependencies for this project.

# Testing -- npm run test
Set up local testing database via pgAdmin. Then, cd into api and into __tests__. Once in __tests__ enter npm run test in terminal to run tests.

# Technologies
knex.js
node.js
express
helmet
json web token
pg

# Full Stack Engineer
Stephen Aranda





### The project is divided into three section

1. Registration form
2. Paymetn page
3. Confirmation Page with registration Id



### Registration Page

1. Basic info as EmailID, username, age and phone number needed on register page.
2. ONLY Any user age between 18 - 65 years can register on the portal.
3. After successful registration of new user have to payment.



### Payment Page

1. After successful registration, user need to pay a fixed amount of INR 500/-.
2. User need to fill the payment mode details.
3. After filling correct information, payment will be successful or unsuccessfull and confirmation message is shown.


### Confirmation Page

After successful payment, a comfirmation will be shown.


### Database

After successful payment, user data is stored in the mongodb database.
Here we have gone with 2 tables users and paymentmodes.

### ER Diagram for both tables

![ER diagram](https://github.com/Arimardan01/The-yoga-DB-form/assets/132728879/48d8c363-1237-4950-8453-9882e7f2175f)


## Important Assumptions made

1. Here you have to register on application form to book a slot and make payment.
2. Every user have a unique ID which will be used to access the service within slot.
3. Both payment details and user details are stored there at system.
4. By clicking on Payment button, payment will be successful or unsuccessfull according to completepayment() function responce here we have only shown for successfull payment in frontend.
5. Validity of one time payment is till last day of the month.
6. User need to register and make payment again for booking a new slot.
7. User cannot book more than one time in a month.
8. The validation is done for the registration page only.

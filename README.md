place order cod show loading_______________________
rate limiter________________________________________
Orders section live update Admin____________________________
ADD to cart loading___________________
console remove____________
add otp login user
payment gateway
riders app
deploy - User app, backend Apis, admin panel frontend.
pagination
api err handling 
out of stock 
delete orders 
work on products location - global
work on saving delivery address for user.
delivery charges & other charges, conditions apply privacy policy.
forget password and fields validations.
Make icons better transparent background.
Automated tests & add ts support for node
usecallback and usememo optimizations , code split uses.

when err remove the imagebyid

user change location remove cart 
add to favorites button for user 
validation for user ordering cart from other location
may be user ordering for others

suggest other screens if user on empty screens
Number should not be negative

Delivery Services - express and normal

ensure user order product from his area only

allow orders status changes  Accept reject

const asyncHandler = fn =>
    (req, res, next) =>
        Promise.resolve(fn(req, res, next))
            .catch(next);

remove unnecessary code and files images , decrese build size            

Priority	Optimization	Impact
⭐⭐⭐⭐⭐	Add MongoDB indexes	Very High
⭐⭐⭐⭐⭐	Use .lean() on read queries	Very High____________
⭐⭐⭐⭐⭐	Cache frequently read data (Redis or in-memory)	Very High
⭐⭐⭐⭐	Use compression	High_________________
⭐⭐⭐⭐	Tune MongoDB connection pool	High__________
⭐⭐⭐⭐	Run with PM2 in cluster mode	High
⭐⭐⭐	Add Helmet and body size limits	Medium_________
⭐⭐⭐	Use Pino for structured logging	Medium_________
⭐⭐	Graceful shutdown and health checks	Medium

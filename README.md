# SauceDemoTest

## Running tests

### Clone the repo
git clone https://github.com/hking144/SauceDemoTest  
cd TestExcersize

### Install dependencies
npm install
npx playwright install

### User testing
Different users can be tested with the "chosenUser" variable in ProductPage.spec.ts  
  0- standard_user  
  1- locked_out_user  
  2- problem_user  
  3- performance_glitch_user  
  4- error_user  
  5- visual_user  
 
### Run tests
npx playwright test tests/ProductPage.spec.ts  
With playwright extension installed you can run tets with the 

## Excercise
The following flows are covered using Playwright/Typescript,

● Validate the User should be able to add an item to the cart

    Product page: test('Log in, add item to cart, check item in cart'),
    logs in,    
    Finds items by position in products list,
    Records name, price and description,
    Adds chosen items to cart,
    Checks cart icon is updated,
    Goes to cart,
    Verifies all items are in cart with correct name, price and description
    
● Validate the User should be able to see the expanded product details

    Unclear on "expanded product details" 
    Product page: AddItem function checks that product description is present
    Product page: CheckCart funtion checks that product page description matches in cart description
    
● Validate the User should be able to sort

    Product page: test('Log in, check sorting is working correctly')
    logs in,
    Applies each available sort order change 
    Checks product list item order against expected sorting
import { test, expect, Page } from '@playwright/test';
import { loginWithUser } from './helpers/login';
import { orderCheck } from './helpers/sortOrderChecks';
import { error } from 'node:console';

const chosenUser = 0;

var expectAddedItems = 0;
var expectedNames: string[] = [];
var expectedDesc: string[] = [];
var expectedPrices: string[] = [];


async function SortList(page: Page, ddIndex: number) {
  const dropdown = page.locator('.product_sort_container');
  const options = dropdown.locator('option');
  const count = await options.count();
  if (ddIndex < 0 || ddIndex >= count) {
    throw new Error(`SortList(ddIndex): index ${ddIndex} out of range (0..${count - 1})`);
  }

  // Some browsers/drivers won't consider <option> "visible" for clicks,
  // so select via the underlying option value.
  const value = await options.nth(ddIndex).getAttribute('value');
  if (!value) throw new Error(`SortList(ddIndex): option at index ${ddIndex} has no value attribute`);
  await dropdown.selectOption(value);
}
async function AddItem(page: Page, itemIndex: number) {
  //finds expected item and clicks add
  const inventoryItems = page.locator('.inventory_item');
  const selectedItem = inventoryItems.nth(itemIndex);
  await selectedItem.locator('button').click();

  //#region Add item to cart checking
  //adds item name, description and price to expected lists for later checks
  expectedNames.push(
    (await page.locator('.inventory_item_name').nth(itemIndex).textContent())!.toString()
  );

  try {
    const description = await page.locator('.inventory_item_desc').nth(itemIndex).textContent();
    if (!description || description.trim().length === 0) {
      throw new Error();
    }
  }
  catch (error) {
    console.error(`Missing Description In Page ${expectedDesc} ❗❗❗ `);
  }
  expectedDesc.push(
    (await page.locator('.inventory_item_desc').nth(itemIndex).textContent())!.toString()
  );

  expectedPrices.push(
    (await page.locator('.inventory_item_price').nth(itemIndex).textContent())!.toString()
  );

  //increments expected items count
  expectAddedItems++;
  //#endregion

  //#region check and error out if cart badge does not match total
  const cartBadge = await page.locator('.shopping_cart_badge').textContent();
  try {
    await expect(cartBadge).toBe(expectAddedItems.toString());
  } catch {
    throw error(`Items in cart: ${cartBadge} fail❗❗❗`);
  }
  //#endregion
}
async function CheckCart(page: Page) {
  await page.locator('.shopping_cart_link').click();

  //count items in cart_list
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(expectAddedItems);

  for (let i = 0; i < expectAddedItems; i++) {
    const currentItem = cartItems.nth(i);

    //get values from each item in cart 
    const actualName = await currentItem.locator('.inventory_item_name').textContent();
    const actualDesc = await currentItem.locator('.inventory_item_desc').textContent();
    const actualPrice = await currentItem.locator('.inventory_item_price').textContent();

    //check values from each item in cart 
    try {
      expect(actualName?.trim()).toBe(expectedNames[i]);
      expect(actualDesc?.trim()).toBe(expectedDesc[i]);
      expect(actualPrice?.trim()).toBe(expectedPrices[i]);
      console.log(`Validated Item ${i + 1}: ${actualName}✅`);
    }
    catch {
      throw new Error(`Unexpected value In Cart ${i + 1}: ${actualName}❗❗❗ 
        \n + Desc ${i + 1}: ${actualDesc}`);
    }
  }
}

test.describe("Start", () => {
  test('Log in, check sorting is working correctly', async ({ page }) => {
    const login = await loginWithUser(page, chosenUser);
    expect(login.success).toBe(true);


    for (const sortType of [3, 2, 1, 0] as const) {
      await SortList(page, sortType);
      await orderCheck(page, sortType);
    }
  });
  test('Log in, add item to cart, check item in cart', async ({ page }) => {
    const login = await loginWithUser(page, chosenUser);
    expect(login.success).toBe(true);

    //await SortList(page, 3);
    //await orderCheck(page, 3);

    await AddItem(page, 1);
    await AddItem(page, 2);
    await AddItem(page, 0);

    await CheckCart(page);
  });
});
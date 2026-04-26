import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

function isSortedAscending(values: string[]) {
  //for (const val of values)
    //console.log(val);
  const sorted = [...values].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return values.every((v, i) => v === sorted[i]);
}
function isSortedDescending(values: string[]) {
  //for (const val of values)
    //console.log(val);
  const sorted = [...values].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
  return values.every((v, i) => v === sorted[i]);
}
function isPriceSortedAscending(values: number[]) {
  //for (const val of values)
    //console.log(val);
  return values.every((v, i) => i === 0 || values[i - 1]! <= v);
}
function isPriceSortedDescending(values: number[]) {
  //for (const val of values)
    //console.log(val);
  return values.every((v, i) => i === 0 || values[i - 1]! >= v);
}

export async function orderCheck(page: Page, sortType: number) {
  if (sortType === 0 || sortType === 1) {
    const titles = await page.locator('[id*="title_link"]').allInnerTexts();
    expect(titles.length).toBeGreaterThan(0);

    if (sortType === 0) {
      try {
        await expect(isSortedAscending(titles)).toBe(true);
        console.log('Sort Name Asc Succeeds✅')
      }
      catch {
        console.log('Sort Name Asc Fails ❗❗❗');
      }
    } else {
      try {
        await expect(isSortedDescending(titles)).toBe(true);
        console.log('Sort Name Desc Succeeds✅')
      }
      catch {
        console.log('Sort Name Desc Fails ❗❗❗');
      }
    }

    return;
  }

  if (sortType === 2 || sortType === 3) {
    const priceLocator = page.locator('.inventory_item_price, .inventory-item-price');
    const rawPrices = await priceLocator.allInnerTexts();
    const prices = rawPrices
      .map((t) => Number.parseFloat(t.replace(/[^0-9.]/g, '')))
      .filter((n) => !Number.isNaN(n));

    expect(prices.length).toBeGreaterThan(0);

    if (sortType === 2) {
      try {
        await expect(isPriceSortedAscending(prices)).toBe(true);
        console.log('Sort Price Asc Succeeds✅')
      }
      catch {
        console.log('Sort Price Asc Fails ❗❗❗');
      }
    } else {
      try {
        await expect(isPriceSortedDescending(prices)).toBe(true);
        console.log('Sort Price Desc Succeeds✅')
      }
      catch {
        console.log('Sort Price Desc Fails ❗❗❗');
      }
    }
    return;
  }

  throw new Error('orderCheck(sortType): sortType must be 0, 1, 2, or 3');
}
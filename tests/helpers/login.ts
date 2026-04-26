import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

//#region Parse environmentConfig
export type EnviroConfig = {
  baseUrl: string;
  usernames: string[];
  password: string;
};
let cached: EnviroConfig | null = null;
export async function getEnviroConfig(): Promise<EnviroConfig> {
  if (cached) return cached;
  const filePath = path.resolve(process.cwd(), 'enviroconfig.json');
  const raw = await readFile(filePath, 'utf-8');
  cached = JSON.parse(raw) as EnviroConfig;
  return cached;
}
//#endregion

// Logs in with user chosen by index specified in Product page test
export async function loginWithUser(page: Page, userIndex: number) {
  const env = await getEnviroConfig();
  const username = env.usernames[userIndex];
  if (!username) throw new Error('enviroconfig.json: usernames list is empty');

  //#region Find UI elements, enter info, attempt login
  await page.goto(env.baseUrl);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(env.password);
  await page.getByRole('button', { name: 'Login' }).click();
  //#endregion
 //#region 
  try {
    await expect(page).toHaveURL(/\/inventory\.html$/, { timeout: 5000 });
    console.log(`${username} login Succeeds ✅`);
    return { username, success: true as const };
  } catch {
    console.log(`${username} login Fails ❗❗❗`);
    return { username, success: false as const };
  }
  //#endregion
}


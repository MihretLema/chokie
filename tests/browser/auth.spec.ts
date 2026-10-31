import {test,expect} from '@playwright/test';
test('anonymous visitors are redirected and the login form hydrates',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/admin');await expect(page).toHaveURL(/\/admin\/login/);
 await expect(page.getByRole('heading',{name:'Welcome back.'})).toBeVisible();
 await page.getByLabel('Email address').fill('browser-fixture@example.com');
 await page.getByLabel('Password',{exact:true}).fill('Invalid-test-password-123');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page.getByRole('alert')).toBeVisible();expect(errors).toEqual([]);
 const response=await page.request.get('/api/admin/dashboard');expect(response.status()).toBe(401);
});
test('password reset rejects incomplete links and public content remains available',async({page})=>{
 await page.goto('/admin/reset-password');await expect(page.getByText('This link is incomplete.',{exact:false})).toBeVisible();
 await page.goto('/');await expect(page.getByRole('main')).toBeVisible();
 const response=await page.request.get('/api/services');expect(response.status()).toBe(200);
 const body=await response.json();expect(body.data.items.length).toBeGreaterThan(0);
});

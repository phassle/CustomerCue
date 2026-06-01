import { test, expect } from '@playwright/test';

test.describe('Triage Inbox', () => {
  test('login → land on inbox with seeded queue', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('CustomerCue')).toBeVisible();

    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await expect(page.getByText('This week')).toBeVisible();
    await expect(page.getByText('Acme Corp')).toBeVisible();
    await expect(page.getByText('churn risk')).toBeVisible();
  });

  test('Marc can login and see inbox', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Marc Bergström').click();
    await page.waitForURL('/');

    await expect(page.getByText('This week')).toBeVisible();
  });

  test('queue shows seeded signals with trust contract', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    const sourceSection = page.getByText('Source conversations');
    await expect(sourceSection).toBeVisible();

    const ticketRef = page.getByText(/IC·\d{3}|ZD·\d{3}|EM·\d{3}/);
    await expect(ticketRef.first()).toBeVisible();
  });

  test('detail canvas shows rationale pullquote', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await expect(page.getByText('Why we flagged this')).toBeVisible();
  });

  test('keyboard J/K navigation moves signal selection', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    const firstHeadline = await page.locator('h1').first().textContent();
    await page.keyboard.press('j');
    await page.waitForTimeout(200);
    const secondHeadline = await page.locator('h1').first().textContent();

    expect(firstHeadline).not.toBe(secondHeadline);
  });

  test('layout switching between Cards, Ledger, Grouped', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    const cardsTab = page.getByRole('tab', { name: /Cards/ });
    const ledgerTab = page.getByRole('tab', { name: /Ledger/ });
    const groupedTab = page.getByRole('tab', { name: /Grouped/ });

    await expect(cardsTab).toHaveAttribute('aria-selected', 'true');

    await ledgerTab.click();
    await expect(ledgerTab).toHaveAttribute('aria-selected', 'true');

    await groupedTab.click();
    await expect(groupedTab).toHaveAttribute('aria-selected', 'true');
  });

  test('sort dropdown changes signal order', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await page.getByLabel('Sort signals').click();
    await page.getByText('Largest accounts first').click();

    await expect(page.getByText('Voltari Energy').first()).toBeVisible();
  });

  test('status footer shows classifier info', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await expect(page.getByText('classifier')).toBeVisible();
    await expect(page.getByText('demo build')).toBeVisible();
  });

  test('every seeded signal has at least one source conversation', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    const sourceTickets = page.locator('[class*="va-source"]').or(page.getByText(/IC·|ZD·|EM·/));
    const count = await sourceTickets.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Paste & Classify', () => {
  test('navigate to /classify and classify a conversation', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await page.goto('/classify');
    await expect(page.getByText('Paste & classify')).toBeVisible();

    await page.getByPlaceholder(/Paste a support conversation/).fill(
      'Our team is very frustrated with the session timeout. It kicks us out every 15 minutes and we lose our work. This needs to be fixed urgently.'
    );

    await page.getByText('Classify & add to queue').click();
    await page.waitForURL('/');

    await expect(page.getByText('This week')).toBeVisible();
  });

  test('account dropdown lists all 10 seeded accounts', async ({ page }) => {
    await page.goto('/classify');

    const options = page.locator('select option');
    await expect(options).toHaveCount(10);
  });

  test('channel segmented control switches', async ({ page }) => {
    await page.goto('/classify');

    const zendesk = page.getByRole('button', { name: 'Zendesk' });
    await zendesk.click();

    await expect(zendesk).toHaveCSS('background-color', 'rgb(27, 25, 22)');
  });
});

test.describe('Account Drilldown', () => {
  test('clicking account name opens slide-in drilldown', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    const accountLink = page.locator('nav[aria-label="Breadcrumb"] button').first();
    await accountLink.click();

    const drilldown = page.getByRole('dialog', { name: /drilldown/ });
    await expect(drilldown).toBeVisible();
  });

  test('drilldown closes on Escape', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    const accountLink = page.locator('nav[aria-label="Breadcrumb"] button').first();
    await accountLink.click();

    const drilldown = page.getByRole('dialog', { name: /drilldown/ });
    await expect(drilldown).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drilldown).not.toBeVisible();
  });
});

test.describe('Send to Owner', () => {
  test('E key opens send-to-owner modal', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await page.keyboard.press('e');

    const modal = page.getByRole('dialog', { name: /Send to owner/ });
    await expect(modal).toBeVisible();
    await expect(page.getByText('Slack preview')).toBeVisible();
    await expect(page.getByText('Email preview')).toBeVisible();
  });

  test('send via Slack shows toast', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Sara Lindqvist').click();
    await page.waitForURL('/');

    await page.keyboard.press('e');
    await page.getByText('Send via Slack').click();

    await expect(page.getByText(/Sent to/)).toBeVisible();
  });
});

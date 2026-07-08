# Crisop

Crisop is a modern grocery and e-commerce storefront built with Next.js and TypeScript.
It includes a customer-facing shopping experience and an admin dashboard for managing products, categories, coupons, orders, warehouses, and stock.

## Product Overview

- Customer shopping pages with category browsing and product filtering
- Cart and checkout workflow
- Wishlist management
- User authentication and account management
- Admin dashboard for products, categories, coupons, orders, warehouse stock, and team management
- Crisop AI chatbot connected to the backend chat API
- Responsive UI using Tailwind CSS and reusable components
- Redux Toolkit state management with persistent cart/wishlist
- Stripe and Google OAuth ready integrations

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Hook Form
- Stripe integration
- Radix UI primitives
- Tiptap rich text editor
- Toast notifications

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and configure the required public keys:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_FACEBOOK_APP_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SENDGRID_API=
```

`NEXT_PUBLIC_API_URL` must point to the Crisop backend API. The chatbot uses the authenticated backend endpoint:

```txt
POST /chat
```

Request body:

```json
{
  "message": "show me fresh fish",
  "inboxId": "optional-inbox-id"
}
```

Expected response data includes `data.botResponse`, which is rendered as markdown in the chatbot UI.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Build

```bash
npm run build
npm run start
```

## Type Check

```bash
npx tsc --noEmit
```

## Chatbot Notes

- Logged-out users cannot send chatbot messages from the frontend
- Logged-out users see a login button inside the chatbot panel
- Bot responses support markdown-style headings, bold text, lists, links, and dividers
- The chatbot sends requests through Redux Toolkit Query using `src/redux/features/bot/chatbot.api.ts`

## Project Structure

- `src/app` — Next.js app routes and layout
- `src/components` — shared, auth, and UI components
- `src/redux` — Redux store and feature slices
- `src/lib` — utilities and helper functions
- `src/services` — API actions and service logic
- `src/style` — global styles and Tailwind setup
- `src/utils` — auth and cart helper functions

## Notes

- Customize environment variables and backend API endpoints as needed
- Update product and admin data sources for your brand
- Ensure any required API keys (Stripe, OAuth) are added in deployment settings

## Author

Created by Mridul Sheikh

## Contact

For updates, improvements, or questions, review the project files and reach out to the author.

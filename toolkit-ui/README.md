  # 企業永續報告書 - UI

## Nuxt howoto

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install the dependencies:

```bash
npm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Environment variable

在本地端開發時，可以直接 `cp env.example .env`。

1. 必要
   - NUXT_PUBLIC_ALGOLIA_APP_ID, for PDF search
   - NUXT_PUBLIC_ALGOLIA_SEARCH_API_KEY, for PDF search
   - NUXT_PUBLIC_ALGOLIA_INDEX_NAME, for PDF search
   - NUXT_PUBLIC_AUTH0_DOMAIN, auth0 domain
   - NUXT_PUBLIC_AUTH0_CLIENT_ID, auth0 client ID


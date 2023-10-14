# 企業永續報告書 - API



## Feathers how-to

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

### Getting started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    npm install
    ```

3. Start your app

    ```
    npm run compile # Compile TypeScript source
    npm run migrate # Run migrations to set up the database
    npm start
    ```

### Environment variable

A valid auth0 application is required to run this project. Create a `.env` file in the root directory of this project and fill in the following variables:

```
1. AUTH0_SUBDOMAIN, subdomain without `.auth0.com`
2. AUTH0_CLIENT_ID, client id
3. AUTH0_CLIENT_SECRET, client secret
4. AUTH0_RS256_PUBLIC_KEY, public key, you can find it in application/advanced settings/certificates
```

In addition, please create a API in auth0 and fill in the following variables:

```
1. API audience: `https://crt.gcaa.org.tw`
```

### Testing

Run `npm test` and all your tests in the `test/` directory will be run.

### Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

### Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).


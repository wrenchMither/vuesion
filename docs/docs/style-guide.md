# Style Guide

The default style guide that is used in this project, is based on the [Vue Style Guide](https://vuejs.org/v2/style-guide/)
and the [Angular Style Guide](https://angular.io/guide/styleguide).

_If you want to save some time and to keep the style guide consistent,
it is recommended to use the included **[Generator CLI](../guide/cli.md)** to generate new code._

## Directory Structure

```
├── code-style-web-storm.xml  // code formatting rules for .idea
├── config                    // webpack configs
├── cypress                   // e2e tests
├── docs                      // can be deleted
├── i18n                      // language files used by vue-i18n
├── logs                      // express logs
├── src
│   ├── app                   // main app code
│   │   ├── app               // app module - contains main component
│   │   ├── app.ts            // app setup
│   │   ├── config            // app configuration with environments
│   │   ├── router.ts         // global routing information
│   │   ├── shared            // shared code
│   │   ├── state.ts          // global app state
│   │   └── store.ts          // vuex store
│   ├── client
│   │   ├── index.ts          // entry point for client application
│   │   └── sw.ts             // service worker
│   ├── index.template.html   // template, needed for SSR and webpack
│   ├── server
│   │   ├── dev               // dev server
│   │   ├── server.ts         // express app
│   │   ├── index.ts          // entry point for server application
│   │   ├── isomorphic.ts     // entry point for server-side rendering
│   │   ├── middlewares       // express middlewares
│   │   ├── routes            // express routes
│   │   └── utils             // utils for SSR
│   └── static                // static files mapped to /
└── tools
    ├── generators            // generator cli
    └── scripts               // productivity tools
```

## What is a Module?

A module is an encapsulated piece of domain logic in your application, this could be for example:

###  Use-cases for a module

**Dynamic page**: consists of a lot of view logic, at least one route and state-management

**Static page**: has no state-management but a route e.g. `/imprint`

**Domain logic with shared view components**: e.g. authentication state, actions, mutations plus login/signup forms but no routes

**Domain logic**: just plain logic with state-management but no routes and no components

_A module usually has routing information,  state management or both._

**You can easily create modules with `npm run g`**

## What is a Connected Component?

A connected component is a [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) with vuex-mappings.

(_these components are different compared to normal components because it is required to set up a vuex mock store for testing_)

## What is a Component?

This is a simple [Single File Component](https://vuejs.org/v2/guide/single-file-components.html)

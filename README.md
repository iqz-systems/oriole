# Oriole

![npm (scoped)](https://img.shields.io/npm/v/@iqz/oriole.svg) ![GitHub](https://img.shields.io/github/license/iqz-systems/oriole.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/iqz-systems/oriole.svg)

![oriole-logo][logo]

A NodeJS REST client for Magento 2 with full Typescript support.

This package is largely inspired by [Marko Nouvak][m-nouvak]'s [magento2-rest-client][magento2-rest-client] and [Divante Ltd][divante-ltd].'s [magento2-rest-client][magento2-rest-client-divante] packages. What they lacked was full Typescript support, which we've filled in, with some additional tweaks of our own.

This module also uses a full Typescript rewrite of [Ddo][ddo]'s [oauth-1.0a][oauth-1-a] module among others.

This is a **Work-in-Progress**. Only a subset of Magento's REST API is implemented. You can help by submitting a PR.

## Why _"Oriole"_?

We were building something else called as **Bluebird** when this one happened as a by-product. We wanted to have something similarly named. Magento's branding scheme is _orange_-ish (?) so we did a Google search for _"orange coloured birds"_ and an _"oriole"_ popped up in the results. Hence the name. :P

## Installation

```bash
npm install @iqz/oriole --save
```

## Usage

You will need to either create an "integration" with Magento 2 or obtain a user token.

To create an integration, you'll have to go to `System > Extensions > Integrations` and `Add New Integration` in the Magento 2 admin panel. Give a name and select the scope of the API and save it to obtain the OAuth keys. Then you can do:

```typescript
import { Oriole } from '@iqz/oriole';

const o = new Oriole({
  oauth: {
    consumerKey: '<your magento consumer key>',
    consumerSecret: '<your magento consumer secret>',
    accessToken: '<your magento access token>',
    accessTokenSecret: '<your magento access secret>'
  },
  url: 'http://localhost:8080/rest' // Put your URL here. It should end with '/rest'
});

console.log(await o.products.list('carrot'));   // Gets you a list of all products searchable by 'carrot'
```

If you are using a user token, replace the `oauth` property above with `bearer` property.

## Changelog

The changelog is available [here][changelog].

[changelog]: ./CHANGELOG.md

[m-nouvak]: https://github.com/nouvak

[ddo]: https://github.com/ddo

[divante-ltd]: https://github.com/DivanteLtd

[magento2-rest-client]: https://github.com/nouvak/magento2-rest-client

[magento2-rest-client-divante]: https://github.com/DivanteLtd/magento2-rest-client

[oauth-1-a]: https://github.com/ddo/oauth-1.0a

[logo]: ./logo.png

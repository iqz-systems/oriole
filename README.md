# Oriole

![oriole-logo][logo]

A NodeJS REST client for Magento 2 with full Typescript support.

This package is largely inspired by [Marko Nouvak][m-nouvak]'s [magento2-rest-client][magento2-rest-client] and [Divante Ltd][divante-ltd].'s [magento2-rest-client][magento2-rest-client-divante] packages. What they lacked was full Typescript support, which we've filled in, with some additional tweaks of our own.

This module also uses a full Typescript rewrite of [Ddo][ddo]'s [oauth-1.0a][oauth-1-a] module among others.

This is a **Work-in-Progress**. Only a subset of Magento's REST API is implemented. You can help by submitting a PR.

## Installation

```bash
npm install @iqz/oriole --save
```

## Usage

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

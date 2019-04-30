import { Oriole } from './oriole';

const o = new Oriole({
  consumer: {
    key: '7pg4z9uoerwf5em0fajo9ky0ihkscj80',
    secret: 'bi1c6pp13mz36tujfn7375ic1teh2lny'
  },
  accessToken: {
    key: 'm6ar94w9782u3fnagbjtwscqs65t7lzw',
    secret: 'm0tqd4yyi2jrepqrsyuhhcwrvcs9xhmw'
  }
});
o.apiCall({});

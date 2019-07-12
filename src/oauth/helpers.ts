export class Helpers {

  /**
   * Sorts object by key and maps them to a key-value pair array.
   * @method sortObject
   * @param  data       object to be sorted
   * @return            sorted and mapped result
   */
  static sortObject<O extends { [k: string]: any }, K extends string>(data: O): Array<{ key: keyof O, value: O[K] }> {
    const keys = Object.keys(data);
    const result = [];

    keys.sort();

    for (const key of keys) {
      result.push({
        key,
        value: data[key],
      });
    }

    return result;
  }

  /**
   * Get Current Unix TimeStamp
   * @method getTimeStamp
   * @return current unix timestamp
   */
  static getTimeStamp(): number {
    return parseInt((new Date().getTime() / 1000) + '', 10);
  }

  /**
   * Percent encode string
   * @method percentEncode
   * @param  str           string to be encoded
   * @return               percent encoded string
   */
  static percentEncode(str: string): string {
    const result = encodeURIComponent(str)
      .replace(/\!/g, '%21')
      .replace(/\*/g, '%2A')
      .replace(/\'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
    return result;
  }

  /**
   * Return the the URL without its querystring.
   * @method getBaseUrl
   * @param  url        Url with query string
   * @return            Url without query string
   */
  static getBaseUrl(url: string): string {
    return url.split('?')[0];
  }
}

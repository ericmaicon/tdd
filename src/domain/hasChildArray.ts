import { Document } from './protocol';

/**
 * check if the item has an array children.
 *
 * @param item
 * @returns boolean
 */
export default function hasChildArray(item: Document) {
  return Object
    .keys(item)
    .reduce((exists:boolean, key:string) => {
      if (exists) {
        return exists;
      }

      return Array.isArray(item[key]);
    }, false);
}

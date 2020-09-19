import { getItemToRemove } from '.';
import { Document, Response } from '../protocol';

/**
 * This function has the responsability to check if the item will be removed.
 *
 * @param originalDocument
 * @param mutation
 */
export default function checkRemoveItem(
  originalDocument: Document,
  mutation: Document,
): Response {
  return Object
    .keys(mutation)
    .filter((key: string) => Array.isArray(mutation[key]))
    .reduce((response: Response, key: string) => {
      // check in the document if the array item exists
      const originalSubDocument = originalDocument[key] as Document[];
      const subDocument = mutation[key] as Document[];

      if (!originalSubDocument || !subDocument) {
        return response;
      }

      // check the removed ones (_delete = true)
      const itemsRemoved = getItemToRemove(originalSubDocument, subDocument, key);

      if (!itemsRemoved) {
        return response;
      }

      return Object.assign(response, itemsRemoved);
    }, {});
}

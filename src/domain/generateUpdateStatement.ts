import { checkInsertItem } from './insert';
import { Document } from './protocol';
import { checkUpdateItem } from './update';

/**
 * Update the originalDocument with a given mutation
 * object
 *
 * @param originalDocument
 * @param mutation
 */
export default function generateUpdateStatement(
  originalDocument: Document,
  mutation: Document,
) {
  let response = {};

  const itemsToUpdate = checkUpdateItem(originalDocument, mutation);
  if (Object.keys(itemsToUpdate).length >= 1) {
    response = Object.assign(response, {
      $update: itemsToUpdate,
    });
  }

  const itemsToInsert = checkInsertItem(mutation);
  if (Object.keys(itemsToInsert).length >= 1) {
    response = Object.assign(response, {
      $add: itemsToInsert,
    });
  }

  return response;
}

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
  const itemsToUpdate = checkUpdateItem(originalDocument, mutation);

  return {
    $update: itemsToUpdate,
  };
}

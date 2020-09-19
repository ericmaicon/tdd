import { generateUpdateStatement } from '..';
import { Document } from '../protocol';

const document = {
  _id: 1,
  name: 'Johnny Content Creator',
  posts: [
    {
      _id: 2,
      value: 'one',
      mentions: [],
    },
    {
      _id: 3,
      value: 'two',
      mentions: [
        {
          _id: 5,
          text: 'apple',
        }, {
        }],
    }, {
      _id: 4, value: 'three', mentions: [],
    }],
} as Document;

describe('generateUpdateStatement', () => {
  test('Should "Update value field of post at index 0" with the input "Update value field of post at index 0"', () => {
    const input = { posts: [{ _id: 2, value: 'too' }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'too',
      },
    });
  });

  test('Should "Update text field in mention with _id of 5, for post with _id of 2" with the input "Update text field in mention at index 1, for post at index 0"', () => {
    const input = { posts: [{ _id: 3, mentions: [{ _id: 5, text: 'pear' }] }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $update: { 'posts.1.mentions.0.text': 'pear' } });
  });

  test('Should "Add post" with the input "dd post; notice that there is no _id because the post doesnt exist yet"', () => {
    const input = { posts: [{ value: 'four' }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $add: { posts: [{ value: 'four' }] } });
  });
});

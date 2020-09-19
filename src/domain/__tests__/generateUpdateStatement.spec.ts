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
        },
        {
          _id: 6,
          text: 'orange',
        },
      ],
    },
    {
      _id: 4,
      value: 'three',
      mentions: [],
    },
  ],
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

  test('Should "Add post" with the input "Add post; notice that there is no _id because the post doesnt exist yet"', () => {
    const input = { posts: [{ value: 'four' }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $add: { posts: [{ value: 'four' }] } });
  });

  test('Should "Add mention to post with _id of 3" with the input "Add mention for post at index 2"', () => {
    const input = { posts: [{ _id: 3, mentions: [{ text: 'banana' }] }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $add: { 'posts.1.mentions': [{ text: 'banana' }] } });
  });

  test('Should "Remove post at index 0" with the input "Remove post with _id of 2"', () => {
    const input = { posts: [{ _id: 2, _delete: true }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $remove: { 'posts.0': true } });
  });

  test('Should "Remove mention with _id of 6, for post with _id of 3" with the input "Remove mention at index 1, for post at index 1"', () => {
    const input = { posts: [{ _id: 3, mentions: [{ _id: 6, _delete: true }] }] };

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({ $remove: { 'posts.1.mentions.1': true } });
  });

  test('Should Update, Add and Remove in single statement', () => {
    const input = {
      posts: [
        { _id: 2, value: 'too' },
        { value: 'four' },
        { _id: 4, _delete: true },
      ],
    } as Document;

    const output = generateUpdateStatement(document, input);

    expect(output).toEqual({
      $update: {
        'posts.0.value': 'too',
      },
      $add: {
        posts: [
          {
            value: 'four',
          },
        ],
      },
      $remove: {
        'posts.2': true,
      },
    });
  });
});

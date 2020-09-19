import util from 'util'
import { generateUpdateStatement } from './domain';
import { Document } from './domain/protocol';

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

const main = () => {
  // 1
  const input1 = { posts: [{ _id: 2, value: 'too' }] };
  const output1 = generateUpdateStatement(document, input1);
  console.log('INPUT: ', util.inspect(input1, false, null, true));
  console.log('OUTPUT: ', util.inspect(output1, false, null, true), '\n');

  // 2
  const input2 = { posts: [{ _id: 3, mentions: [{ _id: 5, text: 'pear' }] }] };
  const output2 = generateUpdateStatement(document, input2);
  console.log('INPUT: ', util.inspect(input2, false, null, true));
  console.log('OUTPUT: ', util.inspect(output2, false, null, true), '\n');

  // 3
  const input3 = { posts: [{ value: 'four' }] };
  const output3 = generateUpdateStatement(document, input3);
  console.log('INPUT: ', util.inspect(input3, false, null, true));
  console.log('OUTPUT: ', util.inspect(output3, false, null, true), '\n');

  // 4
  const input4 = { posts: [{ _id: 3, mentions: [{ text: 'banana' }] }] };
  const output4 = generateUpdateStatement(document, input4);
  console.log('INPUT: ', util.inspect(input4, false, null, true));
  console.log('OUTPUT: ', util.inspect(output4, false, null, true), '\n');

  // 5
  const input5 = { posts: [{ _id: 2, _delete: true }] };
  const output5 = generateUpdateStatement(document, input5);
  console.log('INPUT: ', util.inspect(input5, false, null, true));
  console.log('OUTPUT: ', util.inspect(output5, false, null, true), '\n');

  // 6
  const input6 = { posts: [{ _id: 3, mentions: [{ _id: 6, _delete: true }] }] };
  const output6 = generateUpdateStatement(document, input6);
  console.log('INPUT: ', util.inspect(input6, false, null, true));
  console.log('OUTPUT: ', util.inspect(output6, false, null, true), '\n');

  // 7
  const input7 = {
    posts: [
      { _id: 2, value: 'too' },
      { value: 'four' },
      { _id: 4, _delete: true },
    ],
  } as Document;
  const output7 = generateUpdateStatement(document, input7);
  console.log('INPUT: ', util.inspect(input7, false, null, true));
  console.log('OUTPUT: ', util.inspect(output7, false, null, true), '\n');
}

main();

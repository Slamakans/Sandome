/* eslint-disable */
const { Collection } = require('discord.js');
const { writeCollection, readCollection } = require('../utils/CollectionFunctions.js');

const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

describe('Collection Read & Write', () => {
  const templateNonNestedCollection = new Collection([['foo', 'bar'], ['cool', 'car']]);
  it('Writing non-nested collection', async () => {
    return writeCollection('collection.json', templateNonNestedCollection);
  });

  it('Reading non-nested collection', async () => {
    const collection = await readCollection('collection.json');
    expect(collection.equals(templateNonNestedCollection)).to.equal(true);
  });

  const templateNestedCollection = new Collection([
    ['foo', new Collection([['bar', 'call']])],
    ['a', new Collection([['b', 'c']])]
  ]);
  it('Writing nested collections', async () => {
    await writeCollection('nested_collection.json', templateNestedCollection);
    const data = fs.readFileSync('nested_collection.json', 'utf8');
    expect(data).to.equal('[["foo",["bar","call"]],["a",["b","c"]]]');
  });

  it('Reading nested collections', async () => {
    const collection = await readCollection('nested_collection.json');
    expect(collection.equals(templateNestedCollection)).to.equal(true);
  });
});

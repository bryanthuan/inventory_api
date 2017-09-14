const _ = require('lodash');
const {
  GraphQLString, GraphQLInt, GraphQLID, GraphQLFloat, GraphQLObjectType,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');

const {
  GraphQLDateTime,
} = require('graphql-iso-date');


const Items = require('../data/items');
const ItemType = require('./itemType.js');

const InvoiceType = new GraphQLObjectType({
  name: 'Invoices',
  description: 'An Invoice',
  fields: {
    invoice_number: { type: GraphQLString },
    item_ids: { type: new GraphQLList(GraphQLID) },
    invoice_id: { type: GraphQLID },
    customer_name: { type: GraphQLString },
    customer_id: { type: GraphQLID },
    status: { type: GraphQLString },
    reference_number: { type: GraphQLString },
    date: { type: GraphQLDateTime },
    due_date: { type: GraphQLDateTime },
    due_days: { type: GraphQLString },
    currency_id: { type: GraphQLID },
    currency_code: { type: GraphQLString },
    total: { type: GraphQLFloat },
    balance: { type: GraphQLFloat },
    created_time: { type: GraphQLDateTime },
    is_emailed: { type: GraphQLBoolean },
    reminders_sent: { type: GraphQLInt },
    payment_expected_date: { type: GraphQLString },
    last_payment_date: { type: GraphQLDateTime },
    items: {
      type: new GraphQLList(ItemType),
      resolve: root => root.item_ids.map(itemId => _.find(Items, i => i.item_id === itemId)),
    },
  },
});

module.exports = InvoiceType;

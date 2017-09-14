const _ = require('lodash');
const moment = require('moment');
const {
  GraphQLID, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull,
  GraphQLObjectType, GraphQLSchema,
} = require('graphql');

const Items = require('./data/items');
const Invoices = require('./data/invoices');
const ItemType = require('./types/itemType');
const ItemStatType = require('./types/itemStatType');
const InvoiceType = require('./types/invoiceType');
const { ItemFilter, ItemsFilter } = require('./filters');

// Root Query
const InventoryAPIQueryType = new GraphQLObjectType({
  name: 'InventoryAPIQueryType',
  description: 'Inventory API Query Schema',
  fields: {
    getItem: {
      type: ItemType,
      description: 'Retrieve an Item',
      args: {
        filter: { type: new GraphQLNonNull(ItemFilter) },
      },
      resolve: (source, { filter }) => {
        /*

          FIRST METHOD
          ---------------------------------------------------------------------------
          In the resolve method, the 'filter' argument uses curly braces { } to make
          itself available. By using this method, operations can be performed on the
          'filter' argument directly instead of passing 'args' as the argument and
          exposing 'filter' as 'args.filter'.

          There is also another method. This method will be explained below

         */
        if (filter.item_id) {
          return _.find(Items, i => i.item_id === filter.item_id);
        } else if (filter.tax_id) {
          return _.find(Items, i => i.tax_id === filter.tax_id);
        }
      },
    },
    getItems: {
      type: new GraphQLList(ItemType),
      description: 'List Items',
      args: {
        filter: { type: ItemsFilter },
        first: { type: GraphQLInt },
        last: { type: GraphQLInt },
      },
      resolve: (source, { filter, first, last }) => {
        if (filter) {
          if (filter.group_id) {
            return _.filter(Items, i => i.group_id === filter.group_id);
          }
          if (filter.vendor_id) {
            return _.filter(Items, i => i.vendor_id === filter.vendor_id);
          }
        }
        if (first) {
          return _.slice(Items, 0, first);
        }
        if (last) {
          return _.slice(Items, 0, last).reverse();
        }
        return Items;
      },
    },
    getInvoice: {
      type: InvoiceType,
      description: 'Retrieve an Invoice',
      args: {
        invoice_id: { type: GraphQLID },
        invoice_number: { type: GraphQLString },
        item_id: { type: GraphQLID },
      },
      resolve: (source, args) => {
        /*

          SECOND METHOD: PASSING 'ARGS' DIRECTLY
          ----------------------------------------------------------------------------
          In this resolve method, the args is passed directly. To access 'invoice_id',
          we use 'args.invoice_id'.

         */
        if (args.invoice_id) {
          return _.find(Invoices, inv => inv.invoice_id === args.invoice_id);
        } else if (args.invoice_number) {
          return _.find(Invoices, inv => inv.invoice_number === args.invoice_number);
        } else if (args.item_id) {
          return _.find(Invoices, inv => inv.item_id === args.item_id);
        }
        return null;
      },
    },
    getInvoices: {
      type: new GraphQLList(InvoiceType),
      description: 'List Invoices',
      resolve: () => Invoices,
    },
    getItemStatistic: {
      type: ItemStatType,
      description: 'Get item statistic',
      args: {
        item_id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (source, { item_id }) => {
        const intItem = parseInt(item_id);
        const totalInvoices = Invoices.filter(invoice => invoice.item_ids.includes(intItem) && invoice.status === 'sold');
        const total_sold = totalInvoices.length;
        const total_sold_today = Invoices.filter(invoice => invoice.item_ids.includes(intItem) && invoice.status === 'sold' && moment(invoice.created_time).diff(
          moment(new Date()),
          'days',
        ) === 0).length;


        const total_sold_per_week = Invoices.filter(invoice => invoice.item_ids.includes(intItem) && invoice.status === 'sold' && moment(invoice.created_time).isBetween(
          moment().startOf('isoWeek'),
          moment().endOf('isoWeek'),
        )).length;


        const total_sold_per_month = Invoices.filter(invoice => invoice.item_ids.includes(intItem) && invoice.status === 'sold' && moment(invoice.created_time).isBetween(
          moment().startOf('month').format('YYYY-MM-DD hh:mm'),
          moment().endOf('month').format('YYYY-MM-DD hh:mm'),
        )).length;

        // find max day
        const extractCreatedDay = Invoices.map(invoice => moment(invoice.created_time));
        const maxInvoiceDay = moment.max(...extractCreatedDay);
        // find min day
        const minInvoiceDay = moment.min(...extractCreatedDay);

        const weeksBetween = moment(maxInvoiceDay).diff(moment(minInvoiceDay), 'weeks');
        const monthsBetween = moment(maxInvoiceDay).diff(moment(minInvoiceDay), 'weeks');

        const avg_sold_per_week = total_sold / weeksBetween;
        const avg_sold_per_month = total_sold / monthsBetween;

        const itemsArrayOnly = totalInvoices.map(invoice => invoice.item_ids);

        const frequently_brought_with = [].concat(...itemsArrayOnly).filter(item => item !== intItem);
        return {
          total_sold, total_sold_today, total_sold_per_week, total_sold_per_month, frequently_brought_with, avg_sold_per_week, avg_sold_per_month,
        };
      },
    },
  },
});

// GraphQL Schema declaration
const InventoryAPISchema = new GraphQLSchema({
  query: InventoryAPIQueryType,
});

module.exports = InventoryAPISchema;

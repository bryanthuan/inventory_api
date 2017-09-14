const {
  GraphQLInt, GraphQLID, GraphQLObjectType, GraphQLList, GraphQLFloat,
} = require('graphql');

const ItemStatType = new GraphQLObjectType({
  name: 'ItemStat',
  description: 'Item Statistic',
  fields: {
    total_sold: { type: GraphQLInt },
    total_sold_today: { type: GraphQLInt },
    total_sold_per_week: { type: GraphQLInt },
    total_sold_per_month: { type: GraphQLInt },
    avg_sold_per_week: { type: GraphQLFloat },
    avg_sold_per_month: { type: GraphQLFloat },
    frequently_brought_with: { type: new GraphQLList(GraphQLID) },
  },
});
module.exports = ItemStatType;

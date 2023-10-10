export const typeDefs = `#graphql
type Category {
    id: ID!
    name: String!
    parent: Category
    isActive: Boolean!
  }
  
  input CategoryInput {
    name: String!
    parent: ID
  }
  
  type Query {
    getAllCategories: [Category]
    getCategory(id: ID!): Category
  }
  
  type Mutation {
    createCategory(input: CategoryInput!): Category
    updateCategory(id: ID!, input: CategoryInput!): Category
    deleteCategory(id: ID!): Boolean
  }
  `;
import  Category,  { CategoryInput } from './../models/category.model';

const resolvers = {
  Query: {
    getAllCategories: async () => {
      return await Category.find();
    },
    getCategory: async (_: any, { id }: { id: string }) => {
      return await Category.findById(id);
    },

  },
  Mutation: {
    createCategory: async (_: any, { input }: { input: CategoryInput }) => {
      const category = new Category(input);
      return await category.save();
    },
    updateCategory: async (_: any, { id, input }: { id: string; input: CategoryInput }) => {
      return await Category.findByIdAndUpdate(id, input, { new: true });
    },
    deleteCategory: async (_: any, { id }: { id: string }) => {
      await Category.findByIdAndDelete(id);
      return true;
    },
  },
  Category: {
    parent: async (category: any) => {
      return await Category.findById(category.parent);
    },
  },
};

export default resolvers;
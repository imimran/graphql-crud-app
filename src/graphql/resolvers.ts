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
    deactivateCategory: async (_: any, { id }: { id: string }) => {
      // Find the category to delete
      const category = await Category.findById(id);
      if (!category) {
        throw new Error('Category not found');
      }

      // Deactivate the category and save it
      category.isActive = false;
      await category.save();

      // Recursively deactivate child categories
      async function deactivateChildCategories(parentId: string) {
        const childCategories = await Category.find({ parent: parentId });
        for (const childCategory of childCategories) {
          childCategory.isActive = false;
          await childCategory.save();
          await deactivateChildCategories(childCategory._id);
        }
      }

      // Start deactivating child categories recursively
      await deactivateChildCategories(id);

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
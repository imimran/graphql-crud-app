import { log } from 'console';
import redis from '../libs/redis';
import Category, { CategoryInput } from './../models/category.model';

const resolvers = {
  Query: {
    getAllCategories: async () => {
      try {
        const cacheKey = 'categories';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
          const categories = JSON.parse(cachedData);
          return categories;
        }

        // If not in cache, fetch data from the database
        const categories = await Category.find()
        // Store data in the cache for future requests
        await redis.set(cacheKey, JSON.stringify(categories));
        console.log(JSON.stringify(categories))
        return categories;


      } catch (error) {
        throw new Error('Error retrieving category');
      }
    },
    getCategory: async (_: any, { id }: { id: string }) => {
      try {
        const category = await Category.findById(id);
        if (!category) {
          throw new Error('Category not found');
        }
        return category;
      } catch (error) {
        throw new Error('Error retrieving category');
      }
    },

  },
  Mutation: {
    createCategory: async (_: any, { input }: { input: CategoryInput }) => {
      try {
        const category = new Category(input);
        // Clear the cache for getAllCategories
        await redis.del('categories');
        await category.save()
        return category;
      } catch (error) {
        throw new Error('Error retrieving category');
      }
    },
    updateCategory: async (_: any, { id, input }: { id: string; input: CategoryInput }) => {
      try {
        const updateCategory = await Category.findByIdAndUpdate(id, input, { new: true });
        await redis.del('categories');
        return updateCategory;
      } catch (error) {
        throw new Error('Error retrieving category');
      }
    },
    deleteCategory: async (_: any, { id }: { id: string }) => {
      try {
        await Category.findByIdAndDelete(id);


        await redis.del('categories');
        return "Delete Successfully!";
      } catch (error) {
        throw new Error('Error retrieving category');
      }
    },
    deactivateCategory: async (_: any, { id }: { id: string }) => {
      try {
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
        await redis.del('categories');
        return "Deactive Successfully!";
      } catch (error) {
        throw new Error('Error retrieving category');
      }
    },
  },
  Category: {
    parent: async (category: any) => {
      return await Category.findById(category.parent);
    },
  },
};

export default resolvers;
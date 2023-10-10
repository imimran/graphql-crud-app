import mongoose, { Document, Schema } from 'mongoose';

export interface Category extends Document {
  name: string;
  parent: Schema.Types.ObjectId | null;
  isActive: boolean;
}

export interface CategoryInput {
  name: string;
  description: string;
}

const categorySchema = new Schema<Category>({
  name: { type: String, required: true, unique: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<Category>('Category', categorySchema);
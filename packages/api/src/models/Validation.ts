import mongoose from 'mongoose';

export interface IValidation {
  isMatch: boolean;
  similarity: number;
  userId?: string;
  userName?: string;
  documentType?: string;
  createdAt: Date;
  imageHashes?: {
    referenceImage: string;
    selfieImage: string;
  };
  metadata?: Record<string, any>;
}

const ValidationSchema = new mongoose.Schema<IValidation>({
  isMatch: { type: Boolean, required: true },
  similarity: { type: Number, required: true },
  userId: { type: String },
  userName: { type: String },
  documentType: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageHashes: {
    referenceImage: { type: String },
    selfieImage: { type: String }
  },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

export const Validation = mongoose.models.Validation || mongoose.model<IValidation>('Validation', ValidationSchema);

export default Validation;

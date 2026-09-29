import mongoose, { Schema, Document } from 'mongoose';

export interface IWebhookEvent extends Document {
  provider: string;
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  processed: boolean;
  processedAt?: Date;
  error?: string;
  createdAt: Date;
}

const WebhookEventSchema = new Schema<IWebhookEvent>(
  {
    provider: { type: String, required: true, index: true },
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    processed: { type: Boolean, default: false, index: true },
    processedAt: { type: Date },
    error: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const WebhookEvent = mongoose.model<IWebhookEvent>('WebhookEvent', WebhookEventSchema);

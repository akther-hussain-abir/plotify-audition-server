import mongoose, { Schema, Document } from 'mongoose';

interface Task extends Document {
  name: string;
  completed: boolean;
}

interface Phase extends Document {
  name: string;
  completed: boolean;
  tasks: Task[];
}

const TaskSchema = new Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const PhaseSchema = new Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  tasks: [TaskSchema],
});

const PhaseModel = mongoose.model<Phase>('Phase', PhaseSchema);

export default PhaseModel;

import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required'],
    maxlength: 70,
  },
  companyName: {
    type: String,
    trim: true,
    required: [true, 'companyName is required'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required'],
  },
  role: {
    type: String,
    trim: true,
    required: [true, 'role is required'],
  },
  shortDesc: {
    type: String,
    required: true,
    required: [true, 'shortDesc is required'],
  },
  salary: {
    type: String,
    trim: true,
    required: [true, 'Salary is required'],
  },
  location: String,
  available: {
    type: Boolean,
    default: true,
  },
  jobType: {
    type: Schema.Types.ObjectId,
    ref: 'JobType',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);

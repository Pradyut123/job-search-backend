import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const jobTypeSchema = mongoose.Schema(
  {
    jobTypeName: {
      type: String,
      trim: true,
      required: [true, "job category is required"],
      maxlength: 70,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobType", jobTypeSchema);

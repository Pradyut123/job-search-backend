import Job from "../models/job.model.js";
import JobType from "../models/jobType.model.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      title: req.body.title,
      companyName: req.body.companyName,
      role: req.body.role,
      description: req.body.description,
      shortDesc: req.body.shortDesc,
      salary: req.body.salary,
      location: req.body.location,
      jobType: req.body.jobType,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(error);
  }
};

export const singleJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, {
      new: true,
    })
      .populate("jobType", "jobTypeName")
      .populate("user", "firstName lastName");
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(error);
  }
};

export const showJobs = async (req, res, next) => {
  //enable search query
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  //filter jobs by category

  let ids = [];
  const jobTypeCategory = await JobType.find({}, { _id: 1 });
  jobTypeCategory.forEach((cat) => {
    ids.push(cat._id);
  });

  let cat = req.query.cat;
  let categ = cat !== "" ? cat : ids;

  //jobs by location
  let locations = [];
  const jobByLocation = await Job.find({}, { location: 1 });
  jobByLocation.forEach((val) => {
    locations.push(val.location);
  });
  let setUniqueLocation = [...new Set(locations)];
  let location = req.query.location;
  let locationFilter = location !== "" ? location : setUniqueLocation;

  // Enable pagination
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  // const count = await Job.find({}).estimatedDocumentCount();
  const count = await Job.find({
    ...keyword,
    jobType: categ,
    location: locationFilter,
  }).countDocuments();

  try {
    const jobs = await Job.find({
      ...keyword,
      jobType: categ,
      location: locationFilter,
    })
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.status(200).json({
      success: true,
      jobs,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      setUniqueLocation,
    });
  } catch (error) {
    return next(error);
  }
};

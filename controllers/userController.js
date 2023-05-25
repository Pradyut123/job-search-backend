import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";

// Load all users
export const allUsers = async (req, res, next) => {
  // Enable pagination
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.find({}).estimatedDocumentCount();

  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password")
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.status(200).json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// Show single user
export const singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// Edit user
export const editUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      user,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//jobs history
export const createUserJobsHistory = async (req, res, next) => {
  const { title, description, salary, location } = req.body;

  try {
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return next(ErrorResponse("You must log In", 401));
    } else {
      const addJobHistory = {
        title,
        description,
        salary,
        location,
        user: req.user._id,
      };
      currentUser.jobsHistory.push(addJobHistory);
      await currentUser.save();
    }

    res.status(200).json({
      success: true,
      currentUser,
    });
    next();
  } catch (error) {
    return next(error);
  }
};


export const getUserJobsHistory = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id });
    if (!currentUser) {
      return next(ErrorResponse("You must log in", 401));
    } else {
      const jobHistory = currentUser.jobsHistory;
      res.status(200).json({
        success: true,
        jobHistory,
      });
    }
  } catch (error) {
    return next(error);
  }
};
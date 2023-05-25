import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import { allJobsType, createJobType, deleteJobType, updateJobType } from "../controllers/jobTypeController.js";

const router = express.Router();

// /api/type/create
router.post('/type/create', isAuthenticated, createJobType)
// /api/type/jobs
router.get('/type/jobs', allJobsType)

// /api/type/update/type_id
router.put('/type/update/:type_id', isAuthenticated, isAdmin, updateJobType)
// /api/type/delete/type_id
router.delete('/type/delete/:type_id', isAuthenticated, isAdmin, deleteJobType)

export default router;

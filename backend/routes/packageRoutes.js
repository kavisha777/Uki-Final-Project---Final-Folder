// routes/packageRoutes.js
import express from 'express';
import {
  createPackage,
  getAllPackages,
  deletePackage,
  updatePackage,
} from '../controllers/packageController.js';

const router = express.Router();

// Admin routes
router.post('/', createPackage);       // Add a new package
router.get('/', getAllPackages);       // View all packages
router.put('/:id', updatePackage);     // Update a package
router.delete('/:id', deletePackage);  // Delete a package

export default router;

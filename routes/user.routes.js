const express = require('express');
const users = require('../controllers/user.controller');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const admin = require('firebase-admin');
const { saveRecommendedFoods, getRecommendedFoods, saveRecommendedExercises, getRecommendedExercises } = require('../controllers/SaveRekomend');

// Route untuk user register
router.post('/register', users.registUser);

// Route untuk user login
router.post('/login', users.loginUser);

// Route untuk reset password
router.post('/reset-password', users.resetPassword);

// Route untuk update user profile
router.put('/profile', verifyToken, users.updateProfile);

// Route untuk mendapatkan user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userRecord = await admin.auth().getUser(req.uid);
        res.status(200).send({ userRecord });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send({ message: 'Error fetching user profile.' });
    }
});

// Route untuk logout user
router.post('/logout', verifyToken, users.logoutProfile);

// Route untuk menyimpan makanan yang direkomendasikan
router.post('/save-recommended-foods', verifyToken, saveRecommendedFoods);

// Route untuk mendapatkan makanan yang direkomendasikan
router.get('/get-recommended-foods', verifyToken, getRecommendedFoods);

// Route untuk menyimpan olahraga yang direkomendasikan
router.post('/save-recommended-exercises', verifyToken, saveRecommendedExercises);

// Route untuk mendapatkan olahraga yang direkomendasikan
router.get('/get-recommended-exercises', verifyToken, getRecommendedExercises);

module.exports = router;

const { admin, firestore } = require('../config/firebase'); // Pastikan path ini benar

const saveRecommendedFoods = async (req, res) => {
    const { userId, foods, date } = req.body;

    if (!userId || !Array.isArray(foods) || foods.length !== 3) {
        return res.status(400).send({ message: 'Please provide userId and 3 food objects.' });
    }

    const currentDate = date || new Date().toISOString().split('T')[0]; // Gunakan tanggal saat ini jika tidak ada `date`

    try {
        const batch = firestore.batch();

        foods.forEach(food => {
            const { id, calories, proteins, fat, carbohydrate, name, img, mealType } = food;

            if (!id || !calories || !proteins || !fat || !carbohydrate || !name || !img || !mealType) {
                throw new Error('All food data and meal type must be provided.');
            }

            const foodRef = firestore.collection('users')
                .doc(userId)
                .collection('history')
                .doc(currentDate)
                .collection(mealType)
                .doc(id);

            batch.set(foodRef, {
                id,
                userId,
                date: currentDate,
                mealType,
                calories,
                proteins,
                fat,
                carbohydrate,
                name,
                img
            });
        });

        await batch.commit();
        res.status(201).send({ message: 'Food successfully saved.' });
    } catch (error) {
        console.error('Error saving recommended foods:', error);
        res.status(500).send({ message: 'Error saving foods.', error: error.message });
    }
};

const saveRecommendedExercises = async (req, res) => {
    const { userId, exercises, date } = req.body;

    if (!userId || !Array.isArray(exercises)) {
        return res.status(400).send({ message: 'Please provide userId and exercises array.' });
    }

    const currentDate = date || new Date().toISOString().split('T')[0]; // Gunakan tanggal saat ini jika tidak ada `date`

    try {
        const batch = firestore.batch();

        exercises.forEach(exercise => {
            const { id, name, duration, caloriesBurned, type } = exercise;

            if (!id || !name || !duration || !caloriesBurned || !type) {
                throw new Error('All exercise data must be provided.');
            }

            const exerciseRef = firestore.collection('users')
                .doc(userId)
                .collection('history')
                .doc(currentDate)
                .collection('exercises')
                .doc(id);

            batch.set(exerciseRef, {
                id,
                userId,
                date: currentDate,
                name,
                duration,
                caloriesBurned,
                type
            });
        });

        await batch.commit();
        res.status(201).send({ message: 'Exercises successfully saved.' });
    } catch (error) {
        console.error('Error saving recommended exercises:', error);
        res.status(500).send({ message: 'Error saving exercises.', error: error.message });
    }
};

const getRecommendedFoods = async (req, res) => {
    const { userId, date } = req.query;

    if (!userId || !date) {
        return res.status(400).send({ message: 'Please provide userId and date.' });
    }

    try {
        const meals = ['breakfast', 'lunch', 'dinner'];
        const recommendedFoods = {};

        for (const mealType of meals) {
            const mealSnapshot = await firestore.collection('users')
                .doc(userId)
                .collection('history')
                .doc(date)
                .collection(mealType)
                .get();

            recommendedFoods[mealType] = mealSnapshot.docs.map(doc => doc.data());
        }

        res.status(200).send({ message: 'Foods successfully retrieved.', recommendedFoods });
    } catch (error) {
        console.error('Error retrieving recommended foods:', error);
        res.status(500).send({ message: 'Error retrieving foods.', error: error.message });
    }
};

const getRecommendedExercises = async (req, res) => {
    const { userId, date } = req.query;

    if (!userId || !date) {
        return res.status(400).send({ message: 'Please provide userId and date.' });
    }

    try {
        const exercisesSnapshot = await firestore.collection('users')
            .doc(userId)
            .collection('history')
            .doc(date)
            .collection('exercises')
            .get();

        const recommendedExercises = exercisesSnapshot.docs.map(doc => doc.data());

        res.status(200).send({ message: 'Exercises successfully retrieved.', recommendedExercises });
    } catch (error) {
        console.error('Error retrieving recommended exercises:', error);
        res.status(500).send({ message: 'Error retrieving exercises.', error: error.message });
    }
};

module.exports = {
    saveRecommendedFoods,
    saveRecommendedExercises,
    getRecommendedFoods,
    getRecommendedExercises
};

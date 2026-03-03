const Painting = require('../models/list');

exports.getGallery = async (req, res) => {
    const data = await Painting.aggregate([
        { $sample: { size: 99 } }
    ]);
    res.render('myGallery', {
        allWorks: data,
    });
};
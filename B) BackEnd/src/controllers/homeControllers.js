const Painting = require('../models/list');

exports.getHome = async (req, res) => {
    if(!req.session.user) {
        const data_ = await Painting.find().sort({ _id: -1 }).limit(4);
        const data = await Painting.aggregate([
            { $sample: { size: 99 } }
        ]);
        res.render('myHome', {
            recentWorks: data_,
            allWorks: data,
        });
    }
    else{
        userID = req.session.user.userID
        res.redirect(`http://localhost:3000/user/${userID}`);
    }
};
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
        user = req.session.user
        res.redirect(`http://localhost:3000/user/${user.userID}`);
    }
};
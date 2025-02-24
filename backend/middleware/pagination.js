const paginate = (model) => async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Math.max(parseInt(page), 1);
        limit = Math.max(parseInt(limit), 1);

        const filter = req.filter || {};
        const totalCount = await model.countDocuments(filter); 
        const totalPages = Math.ceil(totalCount / limit); 

        const data = await model.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            page,
            limit,
            totalPages,
            totalCount,
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = paginate;


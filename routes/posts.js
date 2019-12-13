const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
    res.json([
        {name: 'Mehedi', age: 22},
        {name: 'Rakib', age: 24}
    ])
})




module.exports = router;
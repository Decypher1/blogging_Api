const jwt = require('jsonwebtoken');


const getToken = (user_id) => {
    return (jwt.sign({ id: user_id}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRE}))
}

const decryptToken = (req, res, next) => {
    try {
        const authHeaderValue = req.headers.authorization.split(' ')[1];
        const token = jwt.verify(authHeaderValue, process.env.JWT_SECRET);
        return next()
    } catch(err){
        return res.status(401).send({message: 'Unauthorized'})
    }

}

function ensureCorrectUser(req, res, next) {
    try {
      const authHeaderValue = req.headers.authorization.split(' ')[1];
      const token = jwt.verify(authHeaderValue, process.env.JWT_SECRET);
      if (token.email === req.body.email) {
        return next();
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  }   

module.exports = { getToken, decryptToken, ensureCorrectUser };

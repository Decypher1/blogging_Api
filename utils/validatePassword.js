const bcrypt = require('bcrypt');

const validPassword = async (password, hashedPassword) => {
    const userPassword = await bcrypt.compare(password, hashedPassword);
    return userPassword;
};

module.exports = { validPassword };
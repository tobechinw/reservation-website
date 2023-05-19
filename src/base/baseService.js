const mongo = require('#db/mongodb')
const bcrypt = require('bcrypt')
// const { secret, expiryHrs } = require('../secret.json')
const { secret, expiryHrs } = process.env
const jwt = require("jsonwebtoken");

module.exports = {
    authenticate
}

async function authenticate({username, password}){
    const user = await mongo.getUser(username)
    if(user){
        const match = await bcrypt.compare(password, user.password);
        if(match) {
            var token;
			if (expiryHrs == 0)
				token = jwt.sign({ sub: user.username, role: user.role }, secret);
			else {
				token = jwt.sign({ sub: user.username, role: user.role }, secret, {
					expiresIn: expiryHrs.toString() + "h"
				});
			}
            console.log(`token is ${token}`)
			return token;
        }
        throw "Username or password is incorrect"
    }
    throw "User not found"
}
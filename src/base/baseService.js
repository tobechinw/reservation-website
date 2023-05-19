const mongo = require('../db/mongodb')
const bcrypt = require('bcrypt')
const secretConfig = require('../secret.json')
const jwt = require("jsonwebtoken");

module.exports = {
    authenticate
}

async function authenticate({username, password}){
    const user = await mongo.getUser(username)
    console.log(`username is ${user.username} and role is ${user.role}`)
    if(user){
        const match = await bcrypt.compare(password, user.password);
        if(match) {
            var token;
			if (secretConfig.expiryHrs == 0)
				token = jwt.sign({ sub: user.username, role: user.role }, secretConfig.secret);
			else {
				token = jwt.sign({ sub: user.username, role: user.role }, secretConfig.secret, {
					expiresIn: secretConfig.expiryHrs.toString() + "h"
				});
			}
            console.log(`token is ${token}`)
			return token;
        }
        throw "Username or password is incorrect"
    }
    throw "User not found"
}
module.exports = authorize;

function authorize(roles = []){
	if (typeof roles === "string"){
		roles = [roles]
	}

	return (req, res, next) =>{
		if(!req.session.user){
			return res.redirect('/login')
		}
		
		const token = req.session.user.token
		if(!token){
			return res.status(401).json({message: "Unauthorized user"})
		}

		try{
			if (roles.length && !roles.includes(req.user.role)) {
				// user's role is not authorized
				return res.status(401).json({ message: "Unauthorized" });
			}

			// authentication and authorization successful
			next();
		}catch(err){
			res.status(401).json({ message: 'Token not valid' });
		}
	}
}
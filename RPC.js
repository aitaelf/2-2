const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

let users = {};
let newId = 0;

app.post('/rpc', (req, res) => {
	if (typeof(req.body.entity) !== 'undefined' && req.body.entity == 'users') {
		if (typeof(req.body.method) !== 'undefined') {
			let method = req.body.method;
			let userId = req.body.id;
			switch (method) {
				case 'GET':
					res
						.type('json')
						.status(200)
						.json(users);
					break
				case 'POST':
					if (req.body.name !== 'undefined') {
						let name = req.body.name;
						if (isUserExist(name)) {
							res
								.type('json')
								.status(200)
								.send({msg: `User ${name} is already exist`});
						} else {
							let user = User.createUser(name);
							res
								.type('json')
								.status(200)
								.send(user);
						}
					} else {
						res
							.type('json')
							.status(200)
							.send({msg: 'name is undefined'});
					}
					break
				case 'PUT':
					if (req.body.id !== 'undefined') {
						if (userId in users) {
							users[userId].score = users[userId].score + 50;
							res
								.type('json')
								.status(200)
								.send({msg: `User ${userId} updated. New score is ${users[userId].score}`});
						} else {
							res
								.type('json')
								.status(200)
								.send({msg: `User ${userId} does not exist`});
						}
						break
					} else {
						res
							.type('json')
							.status(200)
							.send({msg: 'id is undefined'});
					}
				case 'DELETE':
					if (req.body.id !== 'undefined') {
						if (userId in users) {
							delete users[userId];
							res
								.type('json')
								.status(200)
								.send({msg: `User ${userId} deleted.`});
						} else {
							res
								.type('json')
								.status(200)
								.send({msg: `User ${userId} does not exist`});
						}
						break
					} else {
						res
							.type('json')
							.status(200)
							.send({msg: 'id is undefined'});
					}
			}
		} else {
			res
				.status(500)
				.send('method is undefined');
		}
	} else {
		res.status(500);
		res.send('entity must be "users"');
	}
});

console.log('Server enabled on port ' + port);
app.listen(port);

function isUserExist(name) {
	for (user in users) {
		if (users[user].name == name) return true;
	}
	return false;
}

class User {
	
	constructor(name) {
		this.name = name;
		this.score = 0;
		this.id = newId;
	}
  
	static createUser(name) {
		name = name || '';
		let user = new User(name);
		users[newId] = user;
		newId++;
		return user;
	}
}
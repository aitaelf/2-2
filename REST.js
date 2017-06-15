const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

let users = {};
let newId = 0;

app.get('/', (req, res) => {
	res.send('<a href="/users">Users</a>');
});

app.get('/users', (req, res) => {
	res
		.type('json')
		.status(200)
		.json(users);
});

app.post('/users', (req, res) => {
	if (typeof(req.body.name) !== 'undefined') {
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
			.status(400)
			.send('name is undefined');
	}
});

app.put('/users', (req, res) => {
	if (typeof(req.body.id) !== 'undefined') {
		let userId = req.body.id;
		if (userId in users) {
			users[userId].score = users[userId].score + 50;
			res
				.type('json')
				.status(200)
				.send(users[userId]);
		} else {
			res
				.type('json')
				.status(200)
				.send({msg: `User ${userId} does not exist`});
		}
	} else {
		res
			.type('json')
			.status(400)
			.send('id is undefined');
	}
});

app.delete('/users', (req,res) => {
	if (typeof(req.body.id) !== 'undefined') {
		let userId = req.body.id;
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
	} else {
		res
			.type('json')
			.status(400)
			.send('id is undefined');
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
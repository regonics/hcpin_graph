var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hcpin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('connected');
});

var TestModelSchema = mongoose.Schema({
	name : String
});

var TestModel = mongoose.model('Test', TestModelSchema);

var testx = new TestModel({ name: 'hihihhi' });
console.log(testx.name);

testx.save(function (err, fluffy) {
	console.log('saved');
	if (err)
		console.log(err);
});

TestModel.find(function (err, kittens) {
	console.log('find query');
	console.log(err);
	console.log(kittens);

	if (err)
		console.log(kittens);
});

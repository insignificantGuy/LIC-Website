var express = require("express")
var app = express()
console.log("Express acquired")

var parser = require("body-parser")
var url = parser.urlencoded({ extended: false })
console.log("Post Service Acquired")

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/lic', { useNewUrlParser: true });
console.log("Database Created")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const policyschema = new Schema({
    policy: String,
    subpolicy: String
})

const policymodel = mongoose.model("policy", policyschema)

const messageschema = new Schema({
    name: String,
    email: String,
    mobile: String,
    city: String,
    message: String
})

const messagemodel = mongoose.model("message", messageschema)

const policydetails = new Schema({
    sub: String,
    minage: String,
    maxage: String,
    maxmat: String,
    term: String,
    minsum: String,
    maxsum: String,
    prepay: String,
    loan: String,
    surr: String,
    ondeath: String,
    onmat: String,
    aftmat: String,
    inctax: String
})

const policymodels = mongoose.model("details", policydetails)

app.set('view engine', 'ejs')

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

app.use('/stuff', express.static('stuff'))

app.get('/check', (req, res) => {
    res.render('policy', { ad: {}, user: null, deta: null, det: null })
})

app.post('/check', url, (req, res) => {
    if (req.body.button) {
        let a = req.body.policy
        policymodel.find({ policy: a }, (err, docs) => {
            res.render('policy', { ad: docs, user: "4", deta: null, det: null })
        })
    }
    if (req.body.check) {
        let c = req.body.policy
        let b = req.body.sub
        policymodel.find({ policy: c }, (err, doce) => {
            policymodels.find({ sub: b }, (err, doces) => {

                res.render('policy', { ad: doce, user: "4", deta: "5", det: doces })
            })
        })
    }
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', url, (req, res) => {
    console.log(req.body)
    if (req.body.submit) {
        let newmessage = new messagemodel()
        newmessage.name = req.body.name
        newmessage.email = req.body.email
        newmessage.mobile = req.body.mobile
        newmessage.city = req.body.city
        newmessage.message = req.body.message
        newmessage.save(function (err) {
            if (err) {
                console.log(err)
                return
            }
            else {
                res.render('index')
            }
        });
    }
})
app.get('/policydetails/name=:sub', (req, res) => {
    let a = req.params.sub
    policymodel.find({ subpolicy: a }, (err, doc) => {
        policymodels.find({ sub: a }, (err, docs) => {
            res.render('licdetails', { policy: doc, det: docs })
        })
    })
    console.log(a)
})

app.listen(3000);
const express = require("express");
const morgan = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const Data = require("./lib/data");
const Calc = require("./lib/calc");
const store = require("connect-loki");

const app = express();
const host = "localhost";
const port = 3000;
const LokiStore = store(session);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false,
  },
  name: "test",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));

app.use(flash());

//makes sure error messages go away
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

let userData = new Data();


// Render home page
app.get("/", (req, res) => {
  res.render("home");
});

// Render the results page
app.get("/results", (req, res) => {
  let theDate = Calc.getDate(userData.dataPoints, userData.currentCustomerAmount, userData.futureCustomerGoal); //gets the predicted date
  let messageToUser = '';
  let diffranceArray = Calc.getDiffrance(userData.dataPoints[0]); // calculates an average growth/decline based on user input
  if (Calc.checkIfSucceed(diffranceArray)) { // checks if the pattern is a growth or a decline
    messageToUser = `You will hit your goal of ${userData.futureCustomerGoal} customers/clients/patients/users per week around:`;
  } else if (Calc.checkIfStagnant(diffranceArray)) {
    messageToUser = "You will stay about the same, unless you do something diffrently.";
  } else {
    messageToUser = "You will hit 0 clients/customers/patients/users around:";
  }
  res.render("result", { //renders users answers to keep a sense of state
    date : theDate,
    textResult : messageToUser,
    flash: req.flash(),
  });
});

// Submits user answers
app.post("/results", (req, res, next) => {
  userData = new Data();
  userData.addDataPoints(req.body.dataPoints.replace(/\s/g,'').split(/,/));
  userData.addCurrentCustomerAmount(req.body.currentCustomerAmount);
  userData.addFutureCustomerGoal(req.body.futureCustomerGoal);
  userData.addMinAmountGetFromCustomer(req.body.minAmountGetFromCustomer);
  userData.addMaxAmountGetFromCustomer(req.body.maxAmountGetFromCustomer);
  userData.detectErrors();
  if (userData.errorMessages.length > 0) { //error detection
    userData.errorMessages.forEach(msg => req.flash("error", msg)); //flashes error messages
    res.render("home", {
      flash: req.flash(),
      dataPoints: req.body.dataPoints,
      currentCustomerAmount: req.body.currentCustomerAmount,
      futureCustomerGoal: req.body.futureCustomerGoal,
    });
  } else {
    res.redirect('/results')
  }
});


// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).send(err.message);
});

// Listener
app.listen(port, host, () => {
  console.log(`Calc is listening on port ${port} of ${host}!`);
});
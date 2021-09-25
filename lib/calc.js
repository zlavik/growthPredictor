class Calc {

  static getRandomOdd(dataPoints) {
    return Math.floor(Math.random() * Math.floor(dataPoints.length));
  }


  static calculateWeekOn(dataPoints, currentCustomerAmount, futureCustomersGoal) {
    let weekOn = 0;
    let curCustomerAmt = Number(currentCustomerAmount);

    if (!Calc.checkIfStagnant(dataPoints)) {
      while (curCustomerAmt < Number(futureCustomersGoal) && curCustomerAmt > 0) {
        curCustomerAmt += Number(dataPoints[Calc.getRandomOdd(dataPoints)]);
        weekOn++;
      }
      return weekOn;
    } else {
      return Infinity;
    }
  }

  static checkIfSucceed(data) {
    let sum = 0;
    data.forEach(element => {
      sum += element;
    });
    return sum > 0;
  }
  
  static checkIfStagnant(data) {
    let sum = 0;
    data.forEach(element => {
      sum += element;
    });
    return sum === 0;
  }

  
  static averageWeekPrediction(dataPoints, currentCustomerAmount, futureCustomersGoal) {
    let weekGoal = 0;
    let counter = 1;
  
    while (counter <= 10000) {
      weekGoal += Calc.calculateWeekOn(dataPoints, currentCustomerAmount, futureCustomersGoal);
      counter++;
    }
      return weekGoal / 10000;
  }

  static getDiffrance(dataPoints) {
    let currentNum = dataPoints[0];
    let diffrence = dataPoints[0];
    let newArr = [];
    for (let idx = 0; idx < dataPoints.length; idx++) {
        diffrence = dataPoints[idx] - currentNum;
        newArr.push(diffrence);
        currentNum = dataPoints[idx]
    }
    return newArr;
  }

  static getDate(dataPoints, currentCustomerAmount, futureCustomersGoal) {
    let currentDate = new Date();
    let diffranceArray = Calc.getDiffrance(dataPoints[0]);
    let weekGoal = Calc.averageWeekPrediction(diffranceArray, currentCustomerAmount, futureCustomersGoal);
    if (Calc.checkIfSucceed(diffranceArray)) {
      return new Date(currentDate.setDate(currentDate.getDate() + (weekGoal * 7))).toDateString();
    } else if (Calc.checkIfStagnant(diffranceArray)) {
      return undefined;
    } else {
      return new Date(currentDate.setDate(currentDate.getDate() + (weekGoal * 7))).toDateString();
    }
  }
}

module.exports = Calc;
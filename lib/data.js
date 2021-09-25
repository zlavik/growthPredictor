class Data {
  constructor() {
    this.dataPoints = [];
    this.currentCustomerAmount = 0;
    this.futureCustomerGoal = 0;
    this.minAmountGetFromCustomer = 0;
    this.maxAmountGetFromCustomer = 0;
    this.errorMessages = [];
 }

  addDataPoints(...number) {
    this.dataPoints.push(...number);
 }

  addCurrentCustomerAmount(amount) {
    if (!amount) {
      this.currentCustomerAmount = undefined;
    } else {
      this.currentCustomerAmount = amount;
    }
 }
  
  addFutureCustomerGoal(amount) {
    if (!amount) {
      this.futureCustomerGoal = undefined;
    } else {
      this.futureCustomerGoal = amount;
    }
  }

  addMinAmountGetFromCustomer(amount) {
    this.minAmountGetFromCustomer = amount;
  }

  addMaxAmountGetFromCustomer(amount) {
    this.maxAmountGetFromCustomer = amount;
  }
  
  detectErrors() {
      if (this.dataPoints[0].length < 5) this.errorMessages.push('Please Provide at least 5 records!');
      if (!this.dataPoints[0].every(number => Number.isInteger(Number(number))) || !this.dataPoints[0].every(number => (number >= 0))) this.errorMessages.push(`Please provide only positive numbers in your list`);

      if (!this.currentCustomerAmount) this.errorMessages.push(`Please provide how many clients you're currently seeing (most recent week)!`);
      if (this.currentCustomerAmount && !Number.isInteger(Number(this.currentCustomerAmount)) || Number(this.currentCustomerAmount) < 0) this.errorMessages.push(`Please provide a positive number for your current client amount!`);

      if (!this.futureCustomerGoal) this.errorMessages.push(`Please provide how many clients you want to see as the goal!`);
      if (this.futureCustomerGoal && !Number.isInteger(Number(this.futureCustomerGoal)) || Number(this.futureCustomerGoal) < 0) this.errorMessages.push(`Please provide a positive number for your future client amount!`);
  }
  
}

module.exports = Data;
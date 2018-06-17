// BUDGET CONTROLLER
const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else
      this.percentage = -1;
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function(type) {
    const total = data.allItems[type].reduce((total, item) => total + item.value, 0);
    data.totals[type] = parseFloat(total);
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem(type, des, val) {
      let newItem, ID;
      // Create new ID
      if (data.allItems[type].length > 0)
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      else
        ID = 0;

      // Create new item base on 'inc' or 'exp' type
      if (type === 'exp')
        newItem = new Expense(ID, des, val);
      if (type === 'inc')
        newItem = new Income(ID, des, val);

      // Push it into data structure
      data.allItems[type].push(newItem);

      // Return new element
      return newItem;
    },

    deleteItem(type, id) {
      const index = data.allItems[type]
        .map(item => item.id)
        .indexOf(id);

      if (index !== -1)
        data.allItems[type].splice(index, 1);
    },

    calculateBudget() {
      // 1. Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // 2. Calculate budget income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate percentage of income that we spent
      if (data.totals.inc > 0)
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      else
        data.percentage = -1;
    },

    calculatePercentages() {
      data.allItems.exp.forEach(item => item.calcPercentage(data.totals.inc));
    },

    getPercentages() {
      let allPerc = data.allItems.exp.map(item => item.getPercentage());
      return allPerc;
    },

    getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    logData() {
      console.log(data);
    }
  };

})();

// VIEW CONTROLLER
const UIController = (function() {

  const DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  const formatNumber = function(number, type) {
    let partsNum, int, decimal;

    number = number.toFixed(2);
    partsNum = number.split('.');
    int = partsNum[0];
    decimal = partsNum[1];

    if (int.length > 3)
      int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`

    return `${(type === 'exp' ? '-' : '+')} ${int}.${decimal}`
  }

  return {
    getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem(obj, type) {
      let html, newHTML, element;

      // Create HTML placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Replace the placeholder text with some actual data
      newHTML = html
        .replace('%id%', obj.id)
        .replace('%description%', obj.description)
        .replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);

    },

    deleteListItem(selectorID) {
      const element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    clearField() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(`${DOMstrings.inputDesc}, ${DOMstrings.inputValue}`);
      fieldsArr = [...fields];
      fieldsArr.map(field => field.value = '');
      fieldsArr[0].focus();
    },

    displayBudget(obj) {
      let type = (obj.budget > 0) ? 'inc' : 'exp'
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0)
        document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage}%`;
      else
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
    },

    displayPercentages(percentages) {
      let fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      fieldsArr = [...fields];

      fieldsArr.map((field, index) => {
        field.textContent = `${percentages[index]}%`;
      });

      // const nodeListForEach = function(list, callback) {
      //   for (let i = 0; i < list.length; i++) {
      //     callback(list[i], i);
      //   }
      // };

      // nodeListForEach(fields, (current, index) => {
      //   if (percentages[index] > 0)
      //     current.textContent = `${percentages[index]}%`;
      //   else
      //     current.textContent = '---';
      // });
    },

    displayMonth() {
      let now, year;

      now = new Date();
      year = now.getFullYear();

      document.querySelector(DOMstrings.dateLabel).textContent = year;
    },

    changeType() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        `${DOMstrings.inputType},${DOMstrings.inputDesc},${DOMstrings.inputValue}`
      );

      for (element of fields)
        element.classList.toggle('red-focus');

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },

    getDOMstrings() {
      return DOMstrings;
    }
  };

})();

// GLOBAL CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {

  const setupEventListeners = function() {
    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13)
        ctrlAddItem();
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
  };

  const updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    const budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    const percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = function() {
    let input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the field
      UIController.clearField();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calcaulate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UIController.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

       // 4. Calcaulate and update percentages
       updatePercentages();
    }

  };

  return {
    init() {
      console.log('Application has started.');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

// INIT Application
controller.init();
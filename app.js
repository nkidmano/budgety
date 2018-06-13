// BUDGET CONTROLLER
const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    expensesContainer: '.expenses__list'
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
        html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Replace the placeholder text with some actual data
      newHTML = html
        .replace('%id%', obj.id)
        .replace('%description%', obj.description)
        .replace('%value%', obj.value);

      // Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);

    },

    clearField() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(`${DOMstrings.inputDesc}, ${DOMstrings.inputValue}`);
      fieldsArr = [...fields];
      fieldsArr.map(field => field.value = '');
      fieldsArr[0].focus();
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
  };

  const updateBudget = function() {
    // 1. Calculate the budget

    // 2. Return the budget

    // 3. Display the budget on the UI
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

    }
  };

  return {
    init() {
      console.log('Application has started.');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

// INIT Application
controller.init();
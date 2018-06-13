// CONTROLLER
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

    testing() {
      console.log(data);
    }
  };

})();

// VIEW
const UIController = (function() {

  const DOMstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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

  const ctrlAddItem = function() {
    // 1. Get the field input data
    const input = UICtrl.getInput();

    // 2. Add the item to the budget controller
    const newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on UI
  }

  return {
    init() {
      console.log('Application has started.');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

// Init Application
controller.init();
/*
slice make coppy for the array
*/
var budgetController = (function () {

    var Income = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
    }

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // calculate budget
    var calcBudget = function (type) {
        var sum = 0
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

     var data = {
             allItems: {
                 income: [],
                 expenses: []
             },
             totals: {
                 income: 0,
                 expenses: 0,
         },
         budget: 0,
         percentage :-1
        
    };
    return {
        addItem: function (type, description, value) {
            var newItem, ID;
            // id 
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //  create new item
            if (type === "expenses") {
                newItem = new Expense(ID, description, value)
            } else if (type === "income") {
                newItem = new Income(ID, description, value)
            }

            // push new item to data structure
            data.allItems[type].push(newItem);
            // return new item
            return newItem;   
        },
           // delete item method
          dleteItem : function(type,id){
             var ids ,  index ; 
              ids = data.allItems[type].map(function(current){
              return current.id
             });
              index = ids.indexOf(id);
              if (index!== -1){
                data.allItems[type].splice(index,1)
              }
              
            },

        calculateBudget: function () {
         // calculate budget income & expene
            calcBudget("income");
            calcBudget("expenses");
           // calculate budget income - expene
            data.budget = data.totals.income - data.totals.expenses;
            // percentage            
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expenses / data.totals.income) * 100) 
            } else {
                data.percentage = -1;
            }
        },
        getBudget : function (){
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expenses,
                percentage: data.percentage, 
            }
        },
         
        testing: function() {
            console.log(data)
        }
    };

    


})();

var uiController = ( function(){

    // make data structue 
    var domSrings =
    {
        inputType:"#select-box",
        inputDescription:"#description",
        inputValue:"#value",
        btn: ".add-value",
        incomeContainr:".container-inc",
        expendContainer: ".container-exp",
        budgTotal: "#total",
        budgIncome: "#income",
        budgExpense: "#expenses", 
        budgPercentage: "#percentage",
        removeItem:".my-data", 
    }
   
    return {
        gitInput: function () {
            return {
                type: document.querySelector(domSrings.inputType).value,
                description: document.querySelector(domSrings.inputDescription).value,
                value: parseFloat( document.querySelector(domSrings.inputValue).value),
                   };
       
        },
        addListItem: function (obj, type) {
            // create html 
            var html, newHtml, element;
            if (type === 'income') {
                element = domSrings.incomeContainr;
                html = '<div class="data" id="income-%id%"><div class="name float-left"><p>%description%</p></div><div class="amount-income float-right"><span id="amount-income">%value%</span><span id="removeIncome"><i class="far fa-times-circle"></i></span></div><div class="clearfix"></div></div>';
            } else if (type === 'expenses') {
                element = domSrings.expendContainer;
                html = '<div class="data" id="expenses-%id%"><div class="name float-left"><p>%description%</p></div><div class="amount-expenses float-right"><span id="amount-expenses">%value%</span><span id="percentage-exp">25%</span><span id="removeExpenses"><i class="far fa-times-circle"></i></span></div><div class="clearfix"></div></div> ';
            };
            // Replace placeholder text to my data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // add items to UI
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
         deletListElement : function(selectorId){
          var el =  document.getElementById(selectorId)
          el.parentNode.removeChild(el)

         },
        getdomstrings: function () {
            return domSrings
        },
        /// clear inputs
        clearInputs: function () {
            var fields, fieldsArray
            fields = document.querySelectorAll(domSrings.inputDescription + " , " + domSrings.inputValue);
            // fieldsArray = Array.prototype.slice.call(fields);
            fields.forEach(current => current.value = "");
            fields[0].focus();
        }, 
        displayData: function (obj) {
            document.querySelector(domSrings.budgTotal).textContent = obj.budget;
            document.querySelector(domSrings.budgIncome).textContent = obj.totalInc ;
            document.querySelector(domSrings.budgExpense).textContent = obj.totalExp;
            document.querySelector(domSrings.budgPercentage).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(domSrings.budgPercentage).textContent = obj.percentage + " %"
            } else {
                document.querySelector(domSrings.budgPercentage).textContent = '--'
            }   
        },


    };

}) ();


var controller = ( function( budgetCtrl , uiCtrl){

    var eventListenerfunction = function () {
        // access  data structure
        var dom = uiCtrl.getdomstrings();
        document.querySelector(dom.btn).addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
       document.querySelector(dom.removeItem).addEventListener("click", ctrDeleteItem );

    };

   
     

    // display data when click functon
       var ctrlAddItem = function (){
        var inputs, newItem;
        // get vaues from inputs 
        inputs = uiCtrl.gitInput();
        console.log(inputs)
      // add items to budget contoller
        if (inputs.description !== "" /*&& !isNaN(inputs.value) */ && inputs.value > 0)
        {
            newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);
            // add the item  to ui
            uiCtrl.addListItem(newItem, inputs.type);
            // clear fields
            uiCtrl.clearInputs();
            // ubdate budget in ui
            updateBudget();
        }
       
        
        };
    var ctrDeleteItem = function (e) {
        var ItemId, splitId, type, ID,
            ItemId = e.target.parentNode.parentNode.parentNode.id;
        console.log(ItemId)
        splitId = ItemId.split("-");
        type = splitId[0];
        ID = parseInt(splitId[1]);
        // delete item from data structure 
        budgetCtrl.dleteItem(type, ID);
        //delete item from ui
        uiCtrl.deletListElement(ItemId);
        // update budget 
        
    }

    var updateBudget = function () {
        //calculte the budget
        budgetController.calculateBudget();
        // return budget opj
        var budget = budgetController.getBudget();
        //display pudget to ui
        uiCtrl.displayData(budget);

    };
    
    return {
         init : function()
         {
          eventListenerfunction();
            uiCtrl.displayData({
                totlatInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: 0
            })
        }
    }


    
}) (budgetController , uiController);
controller.init();
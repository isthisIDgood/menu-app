const cookBook = [];
const menu = [];
const shoppingList = [];
const inventory = [];

// Recipe Class
//      name (string) - Name of recipe
//      ingredients (array) - array of objects.  Contains item, amount, unit
//      directions (array) - array of strings
//      cookTime (int) - # of minutes
//      numberFed (int) - # fed
//      chef (string) - recipe owner
//      id (string) - auto-generated
class Recipe {
    constructor(name, ingredients, directions, cookTime, numberFed, chef, id) {
        this.name = name;
        this.ingredients = ingredients;
        this.directions = directions;
        this.cookTime = cookTime;
        this.numberFed = numberFed;
        this.chef = chef;
        this.id = id;
    };
    createRecipe() {
        cookBook.push(this);
    };
    removeRecipe() {
        const index = cookBook.map(item => item.id).indexOf(this.id);
        cookBook.splice(index, 1);
    };
    addToMenu() {
        menu.push(this);
    };
    removeFromMenu() {
        const index = menu.map(item => item.id).indexOf(this.id);
        menu.splice(index, 1);
    };
    markCompleted
};

class ListItem {
    constructor(item, amount, unit, addedStatus, id) {
        this.item = item;
        this.amount = amount;
        this.unit = unit;
        this.addedStatus = addedStatus;
        this.id = id;
    };
    removeFromShoppingList() {
        const index = shoppingList.map(listItem => listItem.id).indexOf(this.id);
        shoppingList.splice(index, 1);
    };
    addToShoppingList() {
        shoppingList.push(this);    //Allow users to add directly to list
    }
    markCompleted() {
        this.addedStatus = true;
    };
    markIncomplete() {
        this.addedStatus = false;
    };
    addToInventory() {
        inventory.push(this);
    };
    removeFromInventory() {
        const index = inventory.map(inventoryItem => inventoryItem.id).indexOf(this.id);
        inventory.splice(index, 1);
    };
}

function createShoppingList() {
    const ingredientDictionary = createIngredientDictionary();
    // console.log(ingredientDictionary)
    ingredientDictionary.forEach((dictionaryItem) => {
        const inventoryIndex = inventory.map(inventoryItem => inventoryItem.item).indexOf(dictionaryItem.item);
        const shoppingListIndex = shoppingList.map(listItem => listItem.item).indexOf(dictionaryItem.item);
        if (inventoryIndex === -1 && shoppingListIndex === -1) {
            //Not in inventory or shopping list
            shoppingList.push(new ListItem(dictionaryItem.item, dictionaryItem.amount, dictionaryItem.unit, false, uuidv4()));
        } else if (inventoryIndex !== -1 && shoppingListIndex === -1 && inventory[inventoryIndex].amount < dictionaryItem.amount) {
            //In Inventory but you need more, not in shopping list
            shoppingList.push(new ListItem(dictionaryItem.item, dictionaryItem.amount - inventory[inventoryIndex].amount, dictionaryItem.unit, false, uuidv4()));
        } else if (shoppingListIndex !== -1 && shoppingList[shoppingListIndex].amount < dictionaryItem.amount) {
            //In shopping list but more is needed in shopping list
            const newTotal = inventoryIndex !== -1 ? dictionaryItem.amount - inventory[inventoryIndex].amount : dictionaryItem.amount;
            shoppingList[shoppingListIndex].amount = newTotal;
        }
    });
};

function createIngredientDictionary() {
    const ingredientDictionary = []
    menu.forEach((menuItem) => {
        menuItem.ingredients.forEach((ingredient) => {
            let amount = ingredient.amount.split(' ')[0]
            if (amount.includes('/')) {
                amount = parseInt(amount.split('/')[0])/parseInt(amount.split('/')[1])
            }
            if (!ingredientDictionary.map(dictionaryItem => dictionaryItem.item).includes(ingredient.item.toUpperCase())) {
                ingredientDictionary.push({
                    item: ingredient.item.toUpperCase(),
                    amount: parseFloat(amount),
                    unit: ingredient.unit
                })
            } else {
                const index = ingredientDictionary.map(dictionaryItem => dictionaryItem.item).indexOf(ingredient.item.toUpperCase())
                ingredientDictionary[index].amount += parseFloat(amount)
            }
        })
    })
    return ingredientDictionary
}

function clearMenu() {
    menu.splice(0, menu.length);
};

function clearShoppingList() {
    shoppingList.splice(0, shoppingList.length);
};

// Testing
inventory.push({
    item: 'CHICKEN',
    amount: '10',
    unit: 'OZ'
},
{
    item: 'HAMBURGER MEAT',
    amount: '1',
    unit: "LB"
},{
    item: 'FLOUR',
    amount: '1',
    unit: 'CUP'
})

const testItem = new Recipe('Chicken Taos',
[
    {
        item: 'chicken',
        amount: '16',
        unit: 'OZ'
    },  
    {
        item: 'flour',
        amount: '1/4',
        unit: 'CUP'
    }
], 
[
    'Cut chicken to desired sized pieces and roll in combined flour, salt, and pepper.',
    'Cook the chicken in margine or oil until nice and golden.'
], '30 Minutes', 4, 'Dad', uuidv4())

const otherTestItem = new Recipe('Chili', 
[
    {
        item: 'Hamburger Meat',
        amount: '1',
        unit: 'LB'
    },
    {
        item: 'Kidney Beans',
        amount: '4',
        unit: 'CANS'
    }
], 
[
        'Brown protein.  Drain Fat',
        'Combine all other ingredients into large pot'
], '20 Minutes', 4, 'Dad', uuidv4())

const lastTestItem = new Recipe('Pesto, Tomato & Mozzarella Baked Chicken', [
    {
        item: 'Chicken',
        amount: '8',
        unit: 'OZ'
    },
    {
        item: 'Tomato',
        amount: '4',
        unit: 'TOMATO'
    }
], 
[
        'Preheat over to 400 degrees',
        'Lightly coat baking dish with olive oil'
], '50 Minutes', 4, 'Robin', uuidv4())

testItem.addToMenu();
otherTestItem.addToMenu();
// lastTestItem.addToMenu();
createShoppingList();
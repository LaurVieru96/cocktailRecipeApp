// Query Selectors
const recipeForm = document.querySelector('#recipe-form');
const recipeContainer = document.querySelector('#recipe-container');
let listItems = [];

// FUNCTIONS
function handleFormSubmit(e){
  e.preventDefault();
  const name = DOMPurify.sanitize(recipeForm.querySelector('#name').value);
  const method = DOMPurify.sanitize(recipeForm.querySelector('#method').value);
  const ice = DOMPurify.sanitize(recipeForm.querySelector('#ice').value);
  const glass = DOMPurify.sanitize(recipeForm.querySelector('#glass').value);
  const drink = DOMPurify.sanitize(recipeForm.querySelector('#drink').value);
  const note = DOMPurify.sanitize(recipeForm.querySelector('#note').value);
  const newRecipe = {
    name,
    method,
    ice,
    glass,
    drink,
    note,
    id: Date.now(),
  }
  listItems.push(newRecipe);
  e.target.reset();
  recipeContainer.dispatchEvent(new CustomEvent('refreshRecipes'));
}

function displayRecipes(){
  const tempString = listItems.map(item => `
    <div class="col">
      <div class="card mb-4 rounded-3 shadow-sm border-primary">
        <div class="card-header py-3 text-white bg-primary border-primary">
          <h4 class="my-0">${item.name}</h4>
        </div>
        <div class="card-body">
          <ul class="text-start">
            <li><strong>Method: </strong>${item.method}</li>
            <li><strong>Ice: </strong>${item.ice}</li>
            <li><strong>Glass Size: </strong>${item.glass}</li>
            <li><strong>Drink: </strong>${item.drink}</li>
            ${!item.note.length ? "" : `<li><strong>Note: </strong>${item.note}</li>`}
          </ul>
          <button class="btn btn-lg btn-outline-danger" aria-label="Delete ${item.name}" value="${item.id}">Delete Recipe</button>
        </div>
      </div>
    </div>
    `).join('');
  recipeContainer.innerHTML = tempString;
}

function mirrorStateToLocalStorage(){
  localStorage.setItem('recipeContainer.list', JSON.stringify(listItems));
}

function loadinitialUI(){
  const tempLocalStorage = localStorage.getItem('recipeContainer.list');
  if(tempLocalStorage === null || tempLocalStorage === []) return;
  const tempRecipes = JSON.parse(tempLocalStorage);
  listItems.push(...tempRecipes);
  recipeContainer.dispatchEvent(new CustomEvent('refreshRecipes'));
}

function deleteRecipeFromList(id){
  listItems = listItems.filter(item => item.id !== id);
  recipeContainer.dispatchEvent(new CustomEvent('refreshRecipes'));
}

// EVENT LISTENERS
recipeForm.addEventListener('submit', handleFormSubmit);
recipeContainer.addEventListener('refreshRecipes', displayRecipes);
recipeContainer.addEventListener('refreshRecipes', mirrorStateToLocalStorage);
window.addEventListener('DOMContentLoaded', loadinitialUI);
recipeContainer.addEventListener('click', (e) => {
  if(e.target.matches('.btn-outline-danger')){
    deleteRecipeFromList(Number(e.target.value));
  };
})









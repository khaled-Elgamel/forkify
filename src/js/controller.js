const recipeContainer = document.querySelector('.recipe');
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/PaginationView.js';
import bookmarksview from './views/bookmarksview.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // render spinner
    recipeView.renderSpinner();

    //0 update results
    resultsView.update(model.getSearchResultsPage());

    //3 update bookmarks view
    bookmarksview.update(model.state.bookmarks);
    //1 loading recipe
    await model.loadRecipe(id);

    // 2 rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    // alert(error);
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1 get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2 load search results
    await model.loadSearchResults(query);

    //3 render search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //4 render the intial pagination button
    PaginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goto) {
  //1 render new results
  resultsView.render(model.getSearchResultsPage(goto));
  //2 render the new pagination button
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // render new recipe
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.state.recipe.bookmarked;
    model.deleteBookmark(model.state.recipe.id);
  }
  //2 update recipe vie
  recipeView.update(model.state.recipe);
  //3 render bookmarks
  bookmarksview.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksview.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // render recipe
    recipeView.render(model.state.recipe);

    //sucess message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksview.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksview.addRenderHandler(controlBookmarks);
  recipeView.addRenderHandler(controlRecipe);
  recipeView.addUpdateServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  PaginationView.addClickHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

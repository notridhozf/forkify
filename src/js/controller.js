import * as model from './model.js';
import { MODAL_CLOSE, HOMEPAGE } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import homepageView from './views/homepageView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////////////////////////////////////////

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected result
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // 1> Loading recipe
    await model.loadRecipe(id); // => will return promise

    // 2> Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    // 1> get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2> load search results
    await model.loadSearchResults(query);

    // 3> render results
    resultsView.render(model.getSearchResultPage());

    // 4> render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = goToPage => {
  // 1> render NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2> render NEW initial pagination
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark
    bookmarksView.render(model.state.bookmarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(() => {
      addRecipeView.toggleWindow;
    }, MODAL_CLOSE * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlHomepage = () => {
  window.location.href = `${HOMEPAGE}`;
  // window.history.pushState(null, '', 'index.html');
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  homepageView.addHandlerHomepage(controlHomepage);
};
init();

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

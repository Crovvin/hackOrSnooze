"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function navBarClick(evt){
  console.debug("navBarClick", evt);
  hidePageComponents();
}

function navCreateStory(e){
  console.debug("navCreateStory", e);
  hidePageComponents();
  $allStoriesList.show();
  $addStoryForm.show();
}

$body.on("click", "#nav-submit", navCreateStory);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-links-div").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navFavoritesTab(e){
  console.debug("navFavoritesTab", e);
  hidePageComponents();
  favoritesList();
}

$body.on("click", "#nav-favorites", navFavoritesTab);

function navMyStoriesTab(e){
  console.debug("navMyStoriesTab", e);
  hidePageComponents();
  $ownStories.show();
  showMyStories();
}

$body.on("click", "#nav-own-stories", navMyStoriesTab);
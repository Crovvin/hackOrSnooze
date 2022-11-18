"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showTrash = false) {
  const hostName = story.getHostName();
  const favoriteIcon = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${favoriteIcon ? makeFavoriteIcon(story, currentUser) : ""}
        ${showTrash ? `<span class="trash-can"><i class="fa-regular fa-trash-can"></i></span>` : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function addStory(evt) {
  console.debug("addStory");
  evt.preventDefault();
  const title = $("#storiestitle").val();
  const author = $("#storiesauthor").val();
  const url = $("#storiesurl").val();
  const user = currentUser.username
  const newStory = { title, author, url, user };
  const story = await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(story, false, Boolean(currentUser));
  $allStoriesList.prepend($story);
  $addStoryForm.trigger("reset");
  $addStoryForm.hide();
}

$addStoryForm.on("submit", addStory);

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function makeFavoriteIcon(story, user){
  const isStoryFavorited = user.isStoryFavorited(story);
  const icon = isStoryFavorited ? "fa-solid" : "fa-regular";
  return ` 
      <span class = "star">
        <i class = "${icon} fa-star"></i>
      </span> `;
}

async function starStory(e){
  console.debug("starStory");
  const $star = $(e.target);
  const $li = $star.closest("li");
  const storyId = $li.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  if ($star.hasClass("fa-solid")){
    await currentUser.removeFavorites(story);
    $star.closest("i").toggleClass("fa-solid fa-regular");
  } else {
    await currentUser.addFavorites(story);
    $star.closest("i").toggleClass("fa-solid fa-regular");
  }
}
$lists.on("click", ".star", starStory);

function favoritesList(){
  $favoriteStories.empty();
  if(currentUser.favorites.length === 0){
    $favoriteStories.append("You currently have no favorites");
  } else {
    for (let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}

function showMyStories(){
  console.debug("showMyStories");
  $ownStories.empty();
  if(currentUser.ownStories.length === 0){
    $ownStories.append("You have no stories");
  } else {
    for(let story of currentUser.ownStories){
      const $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

async function deleteMyStory(e) {
  console.debug("deleteStory");
  const $li = $(e.target).closest("li");
  const storyId = $li.attr("id");
  await storyList.deleteStory(currentUser, storyId);
  await showMyStories();
}

$ownStories.on("click", ".trash-can", deleteMyStory);
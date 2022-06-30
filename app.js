const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const chosenArt = document.createElement("div");

const store = {
  currentPage: 1,
  feeds: [],
};

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
};

const makeFeed = (feeds) => {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
};

const newsFeedPage = () => {
  let newsFeed = store.feeds;

  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeed(getData(NEWS_URL));
  }

  console.log(store.feeds);
  let template = `
    <div class='container max-h-screen m-auto text-center'>
      <h1 class='text-5xl mb-5' >Hackers News</h1>
      <ul>
        {{__news_feed__}} 
      </ul>
      <div class='mt-8'>
        <a class='border-solid bg-slate-400 p-3 m-2 rounded text-white'  href='#/page/{{__prev_page__}}'>Previous Page</a>
        <a class='border-solid bg-slate-400 p-3 m-2 rounded text-white ' href='#/page/{{__next_page__}}'>Next Page</a>
      </div> 
    </div>
    `;

  const newsList = [];
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <li class='mb-4 '>
      <a href='#/show/${newsFeed[i].id}'>
      ${newsFeed[i].read ? "[READ]" : ""} ${newsFeed[i].title} (${
      newsFeed[i].comments_count
    })
      </a>
    </li>
   `);
  }

  template = template.replace("{{__news_feed__}}", newsList.join(""));
  template = template.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  template = template.replace(
    "{{__next_page__}}",
    Math.ceil(newsFeed.length / 10) > store.currentPage
      ? store.currentPage + 1
      : store.currentPage
  );

  container.innerHTML = template;
};

const articlePage = () => {
  const id = location.hash.substring(7);
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  console.log(newsContent);

  for (let i = 0; i < store.feeds.length; i++) {
    if (store.feeds[i].id == +id) {
      store.feeds[i].read = true;
      break;
    }
  }

  function makeComments(comments, call) {
    const commentSting = [];

    for (let i = 0; i < comments.length; i++) {
      commentSting.push(`
      <div style="padding-left: ${40 * call}px;" class="mt-4">
        <p>${comments[i].content} by ${comments[i].user}</p>
      </div>
      `);

      if (comments[i].comments.length > 0) {
        commentSting.push(makeComments(comments[i].comments, call + 1));
      }
    }
    return commentSting.join("");
  }

  container.innerHTML = "";

  let template = `
    <div class='container p-5'>  
      <h1 class='text-5xl mb-8'>${newsContent.title}</h1>
      <div class='mb-5'>
        <h1 class='text-2xl mb-4'>Comments</h1>
        <div>
          {{__comments__}}
        </d>
      </div>
      <div>
        <a class='border-solid bg-slate-400 p-3 m-2 rounded text-white' href=#/page/${store.currentPage}>목록으로</a>
      <div/>
    </ul>`;

  template = template.replace(
    "{{__comments__}}",
    makeComments(newsContent.comments, 0)
  );
  container.innerHTML = template;
};

function router() {
  const routePath = location.hash;
  console.log(routePath);
  if (routePath === "") newsFeedPage();
  else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = +routePath.substring(7);
    newsFeedPage();
  } else articlePage();
}

window.addEventListener("hashchange", router());
router();

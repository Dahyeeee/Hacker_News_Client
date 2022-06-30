const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const chosenArt = document.createElement("div");

const store = {
  currentPage: 1,
};

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
};

const newsFeedPage = () => {
  const newsFeed = getData(NEWS_URL);

  let template = `
    <div>
      <h1>Hackers News</h1>
      <ul>
        {{__news_feed__}} 
      </ul>
      <div>
        <a href='#/page/{{__prev_page__}}'>Previous Page</a>
        <a href='#/page/{{__next_page__}}'>Next Page</a>
      </div> 
    </div>
    `;

  const newsList = [];
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <li>
      <a href='#/show/${newsFeed[i].id}'>
        ${newsFeed[i].title} (${newsFeed[i].comments_count}
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
  console.log(id);
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  console.log(newsContent);

  container.innerHTML = "";

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href=#/page/${store.currentPage}>목록으로</a>
    </div>`;
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

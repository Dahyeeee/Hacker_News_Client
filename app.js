const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const NEWS_URL1 = `https://newsapi.org/v2/everything?q=tesla&from=2022-05-30&sortBy=publishedAt&apiKey=03bc6654d2b34f15a5a3b63fa70af5a1`;
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
  const newsFeed = getData(NEWS_URL1);
  console.log(newsFeed);

  let template = `
  <div>
  <h1>News All Around the World</h1>
    <ul>
      {{__news_feed__}}
    </ul>
    <div>
      <a href='#/page/{{__prev_page__}}'>이전 페이지</a>
      <a href='#/page/{{__next_page__}}'>다음 페이지</a>
    </div>
  </div>
  `;

  const newsList = [];
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <li>
      <a href=${newsFeed.articles[i].url}>
        ${newsFeed.articles[i].title} (${newsFeed.articles[i].author})
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
    Math.ceil(newsFeed.articles.length / 10) > store.currentPage
      ? store.currentPage + 1
      : store.currentPage
  );

  container.innerHTML = template;
};

// const articlePage = () => {
//   const id = location.hash.substring(7);
//   console.log(id);
//   const newsContent = getData(CONTENT_URL.replace("@id", id));
//   console.log(newsContent);
//
//   container.innerHTML = "";
//
//   container.innerHTML = `
//     <h1>${newsContent.title}</h1>
//     <div>
//       <a href=#/page/${store.currentPage}>목록으로</a>
//     </div>`;
// };
function router() {
  const routePath = location.hash;
  console.log(routePath);
  if (routePath === "") newsFeedPage();
  else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = +routePath.substring(7);
    newsFeedPage();
  }
  // else articlePage();
}

window.addEventListener("hashchange", router());

router();

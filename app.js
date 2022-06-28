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

  const newsList = ["<ul>"];
  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <li>
      <a href='#/show/${newsFeed[i].id}'>
        ${newsFeed[i].title} (${newsFeed[i].comments_count}
      </a>
    </li>
   `);
  }
  newsList.push("</ul>");
  newsList.push(`
  <div>
    <a href='#/page/${
      store.currentPage > 1 ? store.currentPage - 1 : 1
    }'>이전 페이지</a> 
    <a href='#/page/${
      Math.ceil(newsFeed.length / 10) > store.currentPage
        ? store.currentPage + 1
        : store.currentPage
    }'>다음 페이지</a>
  </div>`);

  container.innerHTML = newsList.join("");
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

const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const chosenArt = document.createElement("div");

const getData = (url) => {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
};

const newsFeed = getData(NEWS_URL);

console.log(newsFeed);

window.addEventListener("hashchange", () => {
  const id = location.hash.substring(1);
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  console.log(newsContent);

  container.innerHTML = "";

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href=#>목록으로</a>
    </div>`;
  // const title = document.createElement("h1");
  // title.innerHTML = newsContent.title;
  // chosenArt.appendChild(title);
});

const newsList = ["<ul>"];

for (let i = 0; i < newsFeed.length; i++) {
  newsList.push(`
  <li>
    <a href='#${newsFeed[i].id}'>
      ${newsFeed[i].title} (${newsFeed[i].comments_count}
    </a>
  </li>`);
}
newsList.push("</ul>");

container.innerHTML = newsList.join("");

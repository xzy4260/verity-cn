const HOST = "verity-cn.pages.dev";
const KEY = "02b17a9b1ef84ea794d265da8095e86f";

const urls = [
  `${HOST}/`,
  `${HOST}/docs`,
  `${HOST}/download`,
  `${HOST}/changelog`,
  `${HOST}/credits`,
].map((p) => `https://${p}`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
};

const endpoints = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

async function main() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      console.log(
        `[IndexNow] ${endpoint} -> ${res.status} ${res.statusText}`
      );
    } catch (e) {
      console.error(`[IndexNow] ${endpoint} -> FAILED: ${e.message}`);
    }
  }
}

main();

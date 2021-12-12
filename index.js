"use strict";

const functions = require("firebase-functions");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const https = require("https");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function getRecipe(agent) {
      return new Promise((resolve, reject) => {
        let url =
          "https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=1086010096999296407";
        //httpのリクエストを送信
        let req = https.get(url, (res) => {
          let chunk = "";
          //読み込み中の処理
          res.on("data", (c) => {
            chunk += c;
          });

          //読み込み完了時の処理
          res.on("end", () => {
            let response = JSON.parse(chunk);

            let menu = response.result.large;
            let max_menu = menu.length;
            let category = [];
            for (let i = 0; i < 4; i++) {
              // 0以上max_menu未満の整数乱数
              let rand = Math.floor(Math.random() * max_menu);
              while (category.includes(rand))
                rand = Math.floor(Math.random() * max_menu);
              category.push(rand);
            }

            //表示
            const payload = {
              richContent: [
                [
                  {
                    type: "chips",
                    options: [
                      {
                        text: "ペイロテスト",
                      },
                      {
                        text: "テストテスト",
                      },
                      {
                        text: "ペイロテスト",
                      },
                      {
                        text: "テストテスト",
                      },
                    ],
                  },
                ],
              ],
            };
            for (let i = 0; i < 4; i++) {
              payload.richContent[0][0].options[i].text =
                menu[category[i]].categoryName;
            }
            agent.add(
              new Payload(agent.UNSPECIFIED, payload, {
                rawPayload: true,
                sendAsMessage: true,
              })
            );

            //処理終了
            resolve();
          });
        });

        //エラー時の処理
        req.on("error", (e) => {
          console.error(`エラー： ${e.message}`);
        });
      });
    }

    function getConcreteRecipe(agent) {
      return new Promise((resolve, reject) => {
        const dict = {
          人気メニュー: "30",
          定番の肉料理: "31",
          定番の魚料理: "32",
          卵料理: "33",
          ご飯もの: "14",
          パスタ: "15",
          "麺・粉物料理": "16",
          "汁物・スープ": "17",
          "鍋料��": "23",
          サラダ: "18",
          パン: "22",
          お菓子: "21",
          肉: "10",
          魚: "11",
          野菜: "12",
          果物: "34",
          "ソース・調味料・ドレッシング": "19",
          飲みもの: "27",
          "大豆・豆腐": "35",
          その他の食材: "13",
          お弁当: "20",
          "簡単料理・時短": "36",
          節約料理: "37",
          今日の献立: "38",
          健康料理: "39",
          調理器具: "40",
          "その他の目的・シーン": "26",
          中華料理: "41",
          韓国料理: "42",
          イタリア料理: "43",
          フランス料理: "44",
          西洋料理: "25",
          "エスニック料理・中南米": "46",
          沖縄料理: "47",
          日本各地の郷土料理: "48",
          "行事・イベント": "24",
          おせち料理: "49",
          クリスマス: "50",
          ひな祭り: "51",
          "春（3月～5月）": "52",
          "夏（6月～8月）": "53",
          "秋（9月～11月）": "54",
          "冬（12月～2月）": "55",
        };
        let name = agent.parameters.any;
        let url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&categoryId=${dict[name]}&applicationId=1086010096999296407`;
        //httpのリクエストを送信
        let req = https.get(url, (res) => {
          let chunk = "";
          //読み込み中の処理
          res.on("data", (c) => {
            chunk += c;
          });

          //読み込み完了時の処理
          res.on("end", () => {
            let response = JSON.parse(chunk);

            //表示
            const payload = {
              richContent: [
                [
                  {
                    type: "info",
                    title: "Info item title",
                    subtitle: "Info item subtitle",
                    image: {
                      src: {
                        rawUrl: "https://example.com/images/logo.png",
                      },
                    },
                    actionLink: "https://example.com",
                  },
                  {
                    type: "info",
                    title: "Info item title",
                    subtitle: "Info item subtitle",
                    image: {
                      src: {
                        rawUrl: "https://example.com/images/logo.png",
                      },
                    },
                    actionLink: "https://example.com",
                  },
                  {
                    type: "info",
                    title: "Info item title",
                    subtitle: "Info item subtitle",
                    image: {
                      src: {
                        rawUrl: "https://example.com/images/logo.png",
                      },
                    },
                    actionLink: "https://example.com",
                  },
                  {
                    type: "info",
                    title: "Info item title",
                    subtitle: "Info item subtitle",
                    image: {
                      src: {
                        rawUrl: "https://example.com/images/logo.png",
                      },
                    },
                    actionLink: "https://example.com",
                  },
                ],
              ],
            };

            let max_menu = Math.min(response.result.length, 4);
            for (let i = 0; i < max_menu; i++) {
              payload.richContent[0][i].title = response.result[i].recipeTitle;
              payload.richContent[0][i].subtitle =
                response.result[i].recipeDescription;
              payload.richContent[0][i].image.src.rawUrl =
                response.result[i].mediumImageUrl;
              payload.richContent[0][i].actionLink =
                response.result[i].recipeUrl;
            }
            agent.add(
              new Payload(agent.UNSPECIFIED, payload, {
                rawPayload: true,
                sendAsMessage: true,
              })
            );

            //処理終了
            resolve();
          });
        });

        //エラー時の処理
        req.on("error", (e) => {
          console.error(`エラー： ${e.message}`);
        });
      });
    }

    let intentMap = new Map();
    intentMap.set("recipe", getRecipe);
    intentMap.set("recipe - custom", getConcreteRecipe);
    agent.handleRequest(intentMap);
  }
);

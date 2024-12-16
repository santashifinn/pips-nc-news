const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const jestsorted = require("jest-sorted");

const app = require("../app");

const endpointsJson = require("../endpoints.json");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all article objects, minus the body parameter, plus a comment_count parameter", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10); //because of default limit
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBeUndefined();
        });
      });
  });
  test("200: Responds with an array in descending order of date created", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the requested article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-07-09T19:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(11);
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Responds with an error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/did-u-hear")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(3);
        });
      });
  });
  test("200: Responds with an empty array when the article_id exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  test("200: Responds with an array in descending order of date created", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/987654/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Responds with an error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/wot-is-this/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Inserts a new comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I want to add something to this discussion.",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.body).toBe(
          "I want to add something to this discussion."
        );
        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(4);
        expect(comment.author).toBe("icellusedkars");
        expect(comment.votes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("400: Responds with an error message when given an invalid article id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I want to add something to this discussion.",
    };
    return request(app)
      .post("/api/articles/12345678/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given incomplete required data, ex. missing body", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article object", () => {
    const newVote = { inc_votes: -13 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(87);
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/133463")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Responds with an error message when given an invalid article id", () => {
    const newVote = { inc_votes: 33 };
    return request(app)
      .patch("/api/articles/downvote-4-the-win")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given incomplete required data, ie. an empty object", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given incorrect data", () => {
    const newVote = { inc_votes: "bob" };
    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment with the given comment_id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("404: Responds with an error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/98099")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Responds with an error message when given an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/im-not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles?sort_by=:column&order=:order / Responds with an array in specified order of specified column", () => {
  test("200: Responds with an array of articles when given only a single query (sort_by)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("200: Responds with an array of articles when given only a single query (order)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200: Responds with an ascending array of articles by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          descending: false,
        });
      });
  });
  test("200: Responds with a descending array of articles by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test("200: Responds with an ascending array of articles by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", {
          descending: false,
        });
      });
  });
  test("200: Responds with a descending array of articles by created_at", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: Responds with an ascending array of articles by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", {
          descending: false,
        });
      });
  });
  test("200: Responds with a descending array of articles by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("200: Responds with an ascending array of articles by comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("comment_count", {
          descending: false,
        });
      });
  });
  test("400: Responds with an error message when given an invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=christmas&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given an invalid order type", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=xyz")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles?topic=:topic / Responds with an array of articles filtered by topic", () => {
  test("200: Responds with an array of articles filtered by cats topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: Responds with an array of articles filtered by mitch topic AND in descending order by article_id", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10); //because of default limit
        expect(articles).toBeSortedBy("article_id", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Responds with an empty array when filtered by topic query that exists but doesn't have any articles attached to it yet", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });
  test("404: Responds with an error message when given a valid but non-existent topic query", () => {
    return request(app)
      .get("/api/articles?topic=idontexistatall")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with the requested user object", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.username).toBe("lurker");
        expect(user.name).toBe("do_nothing");
        expect(user.avatar_url).toBe(
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
        );
      });
  });
  test("404: Responds with an error message when given a non-existent username", () => {
    return request(app)
      .get("/api/users/billandbentheflowerpotmen")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with the updated comment object", () => {
    const newVote = { inc_votes: 42 };
    return request(app)
      .patch("/api/comments/2")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(56);
      });
  });
  test("404: Responds with an error message when given a valid but non-existent id", () => {
    const newVote = { inc_votes: 6 };
    return request(app)
      .patch("/api/comments/198202")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Responds with an error message when given an invalid comment id", () => {
    const newVote = { inc_votes: 12 };
    return request(app)
      .patch("/api/comments/itsacommentfest")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given incomplete required data, ie. an empty object", () => {
    const newVote = {};
    return request(app)
      .patch("/api/comments/2")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given incorrect data", () => {
    const newVote = { inc_votes: "chameleon" };
    return request(app)
      .patch("/api/comments/2")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Adds a new article", () => {
    const newArticle = {
      author: "lurker",
      title: "I want to hug cats",
      body: "Lots of reasons...",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(typeof article.article_id).toBe("number");
        expect(article.author).toBe("lurker");
        expect(article.title).toBe("I want to hug cats");
        expect(article.body).toBe("Lots of reasons...");
        expect(article.topic).toBe("cats");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(article.votes).toBe(0);
        expect(article.comment_count).toBe(0);
        expect(typeof article.created_at).toBe("string");
      });
  });
  test("400: Responds with an error message when given incomplete required data, ex. missing title", () => {
    const newArticle = {
      author: "lurker",
      body: "Lots of reasons...",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/topics", () => {
  test("201: Adds a new topic", () => {
    const newTopic = {
      slug: "coding",
      description: "let us commence the code",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic.slug).toBe("coding");
        expect(topic.description).toBe("let us commence the code");
      });
  });
  test("400: Responds with an error message when given incomplete required data, ex. missing slug", () => {
    const newTopic = {
      description: "let us commence the code",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: Deletes the article with the given comment_id", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  test("404: Responds with an error message when given a valid but non-existent article id", () => {
    return request(app)
      .delete("/api/articles/98099")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("400: Responds with an error message when given an invalid article id", () => {
    return request(app)
      .delete("/api/articles/not-an-id-at-all")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles - pagination", () => {
  test("200: Responds with an array of article objects paginated according to the user inputs", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(5);
        expect(total_count).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBeUndefined();
        });
      });
  });
  test("200: Responds with an array of article objects paginated according to the default of 10 if no user limit input", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(3);
        expect(total_count).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBeUndefined();
        });
      });
  });
  test("200: Responds with an array of article objects paginated according to multiple query inputs", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&sort_by=article_id&order=desc&limit=3&p=3"
      )
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(3);
        expect(total_count).toBe(12);
        expect(articles).toBeSortedBy("article_id", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("400: Responds with an error message when given an invalid limit query", () => {
    return request(app)
      .get("/api/articles?limit=nolimit")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given an invalid page query", () => {
    return request(app)
      .get("/api/articles?p=ikachu")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments - pagination", () => {
  test("200: Responds with an array of comments for the given article_id paginated according to the user inputs", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=6&p=2")
      .expect(200)
      .then(({ body: { comments, total_count } }) => {
        expect(comments.length).toBe(5);
        expect(total_count).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("200: Responds with an array of article objects paginated according to the default of 10 if no user limit input", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body: { comments, total_count } }) => {
        expect(comments.length).toBe(1);
        expect(total_count).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("400: Responds with an error message when given an invalid limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=defyinglimits")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error message when given an invalid page query", () => {
    return request(app)
      .get("/api/articles/1/comments?p=ipistrelle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("General error tests", () => {
  test("404: Responds with error message when given an invalid endpoint", () => {
    return request(app)
      .get("/api/oh-noes")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

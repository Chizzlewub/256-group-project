const app = angular.module("magApp", []);

app.controller("ArticleCtrl", function ($scope, $http) {

  $scope.article = {
    publication: {}
  };

  function getStoredArticles() {
    return JSON.parse(localStorage.getItem("sd_articles") || "[]");
  }

  function saveArticles(arr) {
    localStorage.setItem("sd_articles", JSON.stringify(arr));
  }

  function nextId(articles) {
    if (!articles.length) return "ART-001";
    const max = Math.max(...articles.map(a =>
      parseInt(a.id.replace("ART-", ""))
    ));
    return "ART-" + String(max + 1).padStart(3, "0");
  }

  $scope.submit = function () {


    if (!$scope.article.title ||
        !$scope.article.sport ||
        !$scope.article.words ||
        !$scope.article.access ||
        !$scope.article.publication.date ||
        !$scope.article.publication.status ||
        !($scope.article.publication.web || $scope.article.publication.mobile)) {
      alert("Please complete all required fields.");
      return;
    }

    const channels = [];
    if ($scope.article.publication.web) channels.push("Web");
    if ($scope.article.publication.mobile) channels.push("Mobile");

    const articles = getStoredArticles();

    const newArticle = {
      id: nextId(articles),
      title: $scope.article.title,
      sport: $scope.article.sport,
      words: parseInt($scope.article.words),
      access: $scope.article.access,
      author: $scope.article.author || "",
      publication: {
        date: $scope.article.publication.date,
        channels,
        status: $scope.article.publication.status,
        notes: $scope.article.publication.notes || ""
      }
    };

    // Save locally
    articles.push(newArticle);
    saveArticles(articles);

    // AJAX REST call
    $http.post("https://jsonplaceholder.typicode.com/posts", newArticle)
      .then(res => console.log("Sent to API:", res.data))
      .catch(err => console.error(err));

    // Reset form
    $scope.article = { publication: {} };

    alert("Article added successfully!");
  };

});
const { useState } = React;

const API = "http://localhost:3000";

function ArticlesApp() {
  const initialArticle = {
    title: "",
    sport: "",
    words: "",
    access: "",
    author: "",
    publication: {
      date: "",
      web: false,
      mobile: false,
      status: "",
      notes: ""
    }
  };

  const [article, setArticle] = useState(initialArticle);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setArticle(prev => ({ ...prev, [field]: value }));
  }

  function updatePublication(field, value) {
    setArticle(prev => ({
      ...prev,
      publication: { ...prev.publication, [field]: value }
    }));
  }

  function submit(e) {
    e.preventDefault();

    if (
      !article.title ||
      !article.sport ||
      !article.words ||
      !article.access ||
      !article.publication.date ||
      !article.publication.status ||
      !(article.publication.web || article.publication.mobile)
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const channels = [];
    if (article.publication.web) channels.push("Web");
    if (article.publication.mobile) channels.push("Mobile");

    const newArticle = {
      title: article.title,
      sport: article.sport,
      words: parseInt(article.words),
      access: article.access,
      author: article.author || "",
      publication: {
        date: article.publication.date,
        channels,
        status: article.publication.status,
        notes: article.publication.notes || ""
      }
    };

    setSubmitting(true);

    // POST to our Node.js backend — saved with status: "pending"
    fetch(`${API}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newArticle)
    })
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(() => {
        setArticle(initialArticle);
        alert("Article submitted successfully! Status: Pending review.");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to submit. Is the server running?");
      })
      .finally(() => setSubmitting(false));
  }

  return React.createElement(
    "div",
    null,
    React.createElement(
      "nav",
      { className: "navbar navbar-expand navbar-light border-bottom px-3" },
      React.createElement(
        "a",
        { className: "navbar-brand fw-bold", href: "home-page.html" },
        "Sports Daily"
      ),
      React.createElement(
        "div",
        { className: "navbar-nav" },
        navLink("Home", "home-page.html"),
        navLink("Article Catalog", "articles.html", true),
        navLink("Subscribe", "subscriber.html"),
        navLink("Store", "shoppingcart.html"),
        navLink("Submission History", "order-history.html"),
        navLink("Admin Approval", "approval.html")
      )
    ),

    React.createElement(
      "div",
      { className: "bg-light border-bottom py-3 px-3" },
      React.createElement("h2", { className: "h4 fw-bold mb-1" }, "Article Catalog"),
      React.createElement(
        "p",
        { className: "text-muted small mb-0" },
        "Submit a new article — it will be saved as Pending for editorial review."
      )
    ),

    React.createElement(
      "form",
      { onSubmit: submit, className: "container-fluid px-3 py-4" },
      React.createElement(
        "div",
        { className: "row g-4" },
        React.createElement(
          "div",
          { className: "col-md-4 col-lg-3" },
          React.createElement(
            "div",
            { className: "card" },
            React.createElement(
              "div",
              { className: "card-body" },
              heading("Submit New Article"),
              input("Title *", article.title, v => updateField("title", v)),
              select("Sport *", article.sport, ["Basketball", "Football", "Baseball", "Soccer", "Other"], v => updateField("sport", v)),
              input("Word Count *", article.words, v => updateField("words", v), "number"),
              select("Access *", article.access, ["Free", "Subscribers Only"], v => updateField("access", v)),
              input("Author", article.author, v => updateField("author", v)),
              input("Publication Date *", article.publication.date, v => updatePublication("date", v), "date"),
              checkbox("Website", article.publication.web, v => updatePublication("web", v)),
              checkbox("Mobile App", article.publication.mobile, v => updatePublication("mobile", v)),
              select(
                "Review Status *",
                article.publication.status,
                ["Draft", "In Review", "Approved", "Published"],
                v => updatePublication("status", v)
              ),
              React.createElement("textarea", {
                className: "form-control form-control-sm mb-3",
                placeholder: "Editorial Notes",
                value: article.publication.notes,
                onChange: e => updatePublication("notes", e.target.value)
              }),
              React.createElement(
                "button",
                {
                  className: "btn btn-dark btn-sm w-100",
                  type: "submit",
                  disabled: submitting
                },
                submitting ? "Submitting..." : "Submit Article"
              )
            )
          )
        )
      )
    )
  );
}

/* helpers */

function heading(text) {
  return React.createElement("h6", { className: "text-uppercase fw-bold mb-3" }, text);
}

function navLink(label, href, active = false) {
  return React.createElement(
    "a",
    { href, className: "nav-link" + (active ? " fw-bold active" : "") },
    label
  );
}

function input(label, value, onChange, type = "text") {
  return React.createElement(
    "div",
    { className: "mb-2" },
    React.createElement("label", { className: "form-label small fw-bold" }, label),
    React.createElement("input", {
      type,
      className: "form-control form-control-sm",
      value,
      onChange: e => onChange(e.target.value)
    })
  );
}

function select(label, value, options, onChange) {
  return React.createElement(
    "div",
    { className: "mb-2" },
    React.createElement("label", { className: "form-label small fw-bold" }, label),
    React.createElement(
      "select",
      {
        className: "form-select form-select-sm",
        value,
        onChange: e => onChange(e.target.value)
      },
      React.createElement("option", { value: "" }, "— Select —"),
      options.map(opt =>
        React.createElement("option", { key: opt }, opt)
      )
    )
  );
}

function checkbox(label, checked, onChange) {
  return React.createElement(
    "div",
    { className: "form-check mb-1" },
    React.createElement("input", {
      className: "form-check-input",
      type: "checkbox",
      checked,
      onChange: e => onChange(e.target.checked)
    }),
    React.createElement("label", { className: "form-check-label" }, label)
  );
}

/* mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ArticlesApp));

import {
  auth,
  onAuthStateChanged,
  signOut,
  db,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  where,
  doc,
} from "./firebase.js";

let name = document.getElementById("name");
let email = document.getElementById("email");
let loader = document.getElementById("loader");
let main_content = document.getElementById("main-content");

const loginRegisterBtn = document.getElementById("loginRegisterBtn");

// Redirect to login page
if (loginRegisterBtn) {
  loginRegisterBtn.addEventListener("click", () => {
    window.location = "login.html";
  });
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);

    if (!window.location.pathname.endsWith("profile.html")) {
      window.location = "profile.html";
    }

    if (loader) loader.style.display = "none";
    if (main_content) main_content.style.display = "block";

    if (email) email.innerHTML = user.email;
    if (name) name.innerHTML = user.email.slice(0, user.email.indexOf("@"));
  } else {
    console.log("User not logged in.");

    if (
      !window.location.pathname.endsWith("login.html") &&
      !window.location.pathname.endsWith("register.html") &&
      !window.location.pathname.endsWith("index.html")
    ) {
      window.location = "index.html";
    }
  }
});

// Logout function
let logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Logged out");
      window.location = "index.html";
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });
};

let logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// Add post
let addPost = async () => {
  let title = document.getElementById("title");
  let content = document.getElementById("content");
  const category = document.getElementById("category").value.trim().toLowerCase();

  if (title.value.trim() && content.value.trim()) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        author: auth.currentUser?.email,
        title: title.value,
        content: content.value,
        ServerTimestamp: serverTimestamp(),
        category,
        date: new Date().toLocaleDateString(),
        readTime: "5 min",
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Post added successfully!");
      title.value = "";
      content.value = "";
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post.");
    }
  } else {
    alert("Title and content cannot be empty.");
  }
};

let addPostBtn = document.getElementById("addPostBtn");
if (addPostBtn) {
  addPostBtn.addEventListener("click", addPost);
}

// Get all posts
let getAllPosts = () => {
  const q = query(collection(db, "posts"), orderBy("ServerTimestamp", "desc"));
  let postListElement = document.getElementById("postList");

  if (!postListElement) {
    console.error("postList element not found in the DOM.");
    return;
  }

  onSnapshot(q, (querySnapshot) => {
    postListElement.innerHTML = ""; // Clear previous content
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postId = doc.id;
      const isCurrentUser = auth.currentUser && auth.currentUser.email === postData.author;

      const postElement = document.createElement("div");
      postElement.className = "blog-post container mt-4 border border-2 border-primary rounded p-3";
      postElement.dataset.postId = postId;
      postElement.innerHTML = `
        <div class="row justify-content-center align-items-center text-center">
          <div class="col-md-12">
            <div class="d-flex justify-content-between">
              <small class="meta-info text-primary">${new Date(postData.ServerTimestamp?.toDate() || Date.now()).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</small>
              
              ${
                isCurrentUser
                  ? `<div>
                      <button class="btn btn-outline-secondary btn-sm edit-post-btn">Edit</button>
                      <button class="btn btn-outline-danger btn-sm delete-post-btn">Delete</button>
                    </div>`
                  : ""
              }
            </div>
            <h5>${postData.title}</h5>
            <p class="text-secondary">${postData.content}</p>
            <div class="d-flex align-items-center justify-content-evenly">
                <button class="custom-button btn btn-outline-secondary rounded-pill"">${postData.category}</button>
                <small class="meta-info me-3 text-primary">By ${postData.author.slice(0, postData.author.indexOf("@"))}</small>
                <small class="meta-info text-primary">${postData.readTime}</small>
              </div>
          </div>
        </div>
      `;

      // Add event listeners for edit and delete buttons if user is the author
      if (isCurrentUser) {
        postElement.querySelector(".edit-post-btn").addEventListener("click", () => {
          showEditForm(postId, postData.title, postData.content);
        });
        postElement.querySelector(".delete-post-btn").addEventListener("click", () => {
          deletePost(postId);
        });
      }

      postListElement.appendChild(postElement);
    });
  });
};

// Show edit form
let showEditForm = (postId, currentTitle, currentContent) => {
  const postElement = document.querySelector(`[data-post-id="${postId}"]`);
  postElement.innerHTML = `
    <div class="form-group">
      <input class="form-control mb-3" type="text" id="editTitle" value="${currentTitle}" />
      <textarea class="form-control mb-3" id="editContent" rows="3">${currentContent}</textarea>
      <button class="btn btn-primary save-edit-btn">Save Changes</button>
      <button class="btn btn-secondary cancel-edit-btn">Cancel</button>
    </div>
  `;

  postElement.querySelector(".save-edit-btn").addEventListener("click", () => {
    updatePost(postId);
  });
  postElement.querySelector(".cancel-edit-btn").addEventListener("click", getAllPosts);
};

// Update post
let updatePost = async (postId) => {
  const newTitle = document.getElementById("editTitle").value.trim();
  const newContent = document.getElementById("editContent").value.trim();

  if (newTitle && newContent) {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title: newTitle,
        content: newContent,
        ServerTimestamp: serverTimestamp(),
      });
      alert("Post updated successfully!");
      getAllPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the post.");
    }
  } else {
    alert("Title and content cannot be empty.");
  }
};

// Delete post
let deletePost = async (postId) => {
  if (confirm("Are you sure you want to delete this post?")) {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      alert("Post deleted successfully!");
      getAllPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  }
};

// Fetch posts on page load
getAllPosts();





// Function to fetch posts by category
let searchByCategory = async () => {
  const categoryInput = document.getElementById("searchCategory").value.trim().toLowerCase(); // Convert to lowercase
  const postListElement = document.getElementById("postList");

  if (!categoryInput) {
    alert("Please enter a category to search.");
    return;
  }

  try {
    const q = query(collection(db, "posts"), where("category", "==", categoryInput));
    const querySnapshot = await getDocs(q);

    postListElement.innerHTML = ""; // Clear previous results

    if (querySnapshot.empty) {
      postListElement.innerHTML = `< p > No posts found for category: ${categoryInput}</p > `;
      return;
    }

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postListElement.innerHTML +=
        `   <hr>
        <div class="blog-post container mt-5 border border-2 border-primary rounded p-3">
          <div class="row justify-content-center align-items-center text-center">
            <div class="col-md-9">
              <div class="d-flex justify-content-start">
                <small class="meta-info text-primary">${new Date(postData.ServerTimestamp?.toDate() || Date.now()).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</small>
              </div>
              <h5>${postData.title}</h5>
              <p class="text-secondary">${postData.content}</p>
              <div class="d-flex align-items-center justify-content-evenly">
                <button class="custom-button btn btn-outline-secondary rounded-pill">${postData.category}</button>
                <small class="meta-info me-3">By ${postData.author}</small>
                <small class="meta-info text-primary">${postData.readTime}</small>
              </div>
              <br>
            </div>
          </div>
        </div>`
        ;

    });

    console.log(`Posts found for category '${categoryInput}':`, querySnapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    alert("Failed to fetch posts. Please try again.");
  }
};

// Add event listener to search button
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", searchByCategory);
}




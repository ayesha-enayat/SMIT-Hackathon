import {
  auth,
  onAuthStateChanged,
  signOut,
   db,
  getDoc,
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
} from "./firebase.js";

let name = document.getElementById('name');
let email = document.getElementById('email');
let loader = document.getElementById('loader');
let main_content = document.getElementById('main-content');

const loginRegisterBtn = document.getElementById("loginRegisterBtn");

// Redirect to login page on button click
if (loginRegisterBtn) {
  loginRegisterBtn.addEventListener("click", () => {
    window.location = "login.html";
  });
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user);


    // If user is logged in, redirect to profile.html (only if not already on profile page)
    if (!window.location.pathname.endsWith("profile.html")) {
      window.location = "profile.html";
    }

   // Display user info if on profile.html
    if (loader) loader.style.display = "none";
    if (main_content) main_content.style.display = "block";

    if (email) email.innerHTML = user.email;
    if (name) name.innerHTML = user.email.slice(0, user.email.indexOf("@"));
  } else {
    console.log("User not logged in.");

    // Redirect to login.html only if not on login or register page
    if (!window.location.pathname.endsWith("login.html") &&
      !window.location.pathname.endsWith("register.html") &&
      !window.location.pathname.endsWith("index.html")) {
      window.location = "index.html";
    }
  }
});

// Logout function
let logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Logged out");
      window.location = "index.html"; // Redirect to home page after logout
    })
    .catch((error) => {
      console.log("Error during logout:", error);
    });
};

let logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}



//add post function
let addPost = async () => {
  let title = document.getElementById("title");
  let content = document.getElementById("content");
  const category = document.getElementById("category").value.trim().toLowerCase(); // Convert to lowercase
  console.log(title.value, content.value);
  const docRef = await addDoc(collection(db, "posts"), {
    title: title.value,
    content: content.value,
    ServerTimestamp: serverTimestamp(),
    category: category
  });
  console.log("Document written with ID: ", docRef.id);
  alert("Post added successfully!");

}
let addPostBtn = document.getElementById("addPostBtn");
if (addPost) {
  addPostBtn.addEventListener('click', addPost);
} else {
  console.log("addPostBtn not found");
}


//get all post function
let getAllPost = () => {
  const q = query(collection(db, "posts"), orderBy('ServerTimestamp', 'desc'));
  let postListElement = document.getElementById("postList"); // HTML element to display posts

  if (!postListElement) {
    console.error("postList element not found in the DOM.");
    return;
  }

  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    postListElement.innerHTML = ""; // Clear previous content

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      let userName= document.getElementById('name');
      // Append each post to the container
      postListElement.innerHTML += `
     
      <hr>
        <div class="container mb-4">
          <h3 class="text-primary">Post Title: ${postData.title}</h3>
          <p>Content: ${postData.content}</p>
          <small>Category: ${postData.category}</small><br><br>
        </div>
        `

    });

    


    console.log("All Posts:", querySnapshot.docs.map(doc => doc.data()));
  });
};

getAllPost();




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
            postListElement.innerHTML = `<p>No posts found for category: ${categoryInput}</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const postData = doc.data();
            postListElement.innerHTML += `
                <div class="container">
                    <h3 class="text-primary">${postData.title}</h3>
                    <p>${postData.content}</p>
                    <small>Category: ${postData.category}</small>
                </div>`;
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


//Edit Post

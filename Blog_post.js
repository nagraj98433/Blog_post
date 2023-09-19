// Getting all required elements from html page
document.addEventListener("DOMContentLoaded", function () {
  const blogForm = document.getElementById("blogForm");
  const blogList = document.getElementById("blogList");
  const modal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const modalImage = document.getElementById("modalImage");
  const editForm = document.getElementById("editForm");
  const editTitleInput = document.getElementById("editTitle");
  const editContentInput = document.getElementById("editContent");
  const editImageInput = document.getElementById("editImage");
  const saveEditBtn = document.getElementById("saveEditBtn");
  const editBtn = document.getElementById("editBtn");
  const closeBtn = document.getElementsByClassName("close")[0];

  let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];
  let currentlyEditedPostIndex = null;

  // Function to save posts to local storage
  function savePostsToLocalStorage() {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }

  // Event listener for form submission
  blogForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").files[0];

    if (title && content) {
      const post = {
        title,
        content,
        image: image ? URL.createObjectURL(image) : null,
      };

      posts.push(post);
      savePostsToLocalStorage();
      displayPosts();
      blogForm.reset();
    }
  });

  // Function to display all blog posts
  function displayPosts() {
    blogList.innerHTML = "";
    posts.forEach((post, index) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("blog-post");
      postDiv.innerHTML = `
        <h3 class="blogs_card_title">${post.title}</h3>
        <p class="blog_font">${post.content.substring(0, 100)}...</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      // Event listener for viewing post
      postDiv.addEventListener("click", () => viewPost(index));

      blogList.appendChild(postDiv);
    });
  }

  // Event listener to close the modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Event listener for "Edit" and "Delete" buttons
  blogList.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("edit-btn")) {
      const postDiv = target.parentElement;
      const index = Array.from(postDiv.parentElement.children).indexOf(postDiv);
      editPost(index);
    } else if (target.classList.contains("delete-btn")) {
      const postDiv = target.parentElement;
      const index = Array.from(postDiv.parentElement.children).indexOf(postDiv);
      deletePost(index);
    }
  });

  // Function to view a single blog post in a modal
  function viewPost(index) {
    const post = posts[index];
    modalTitle.textContent = post.title;
    modalContent.textContent = post.content;
    modalImage.src = post.image || "";
    modal.style.display = "block";
    editForm.style.display = "none";
    editBtn.style.display = "block";
  }

  // Function to edit a blog post
  function editPost(index) {
    currentlyEditedPostIndex = index;
    const post = posts[index];
    editTitleInput.value = post.title;
    editContentInput.value = post.content;
    modal.style.display = "block";
    editForm.style.display = "block";
    editBtn.style.display = "none";
  }

  // Event listener for "Save Edit" button
  saveEditBtn.addEventListener("click", () => {
    if (currentlyEditedPostIndex !== null) {
      const newTitle = editTitleInput.value;
      const newContent = editContentInput.value;
      const newImage = document.getElementById("editImage").files[0];

      if (newTitle && newContent) {
        const post = posts[currentlyEditedPostIndex];
        post.title = newTitle;
        post.content = newContent;
        if (newImage) {
          post.image = URL.createObjectURL(newImage);
        }
        currentlyEditedPostIndex = null;
        savePostsToLocalStorage();
        displayPosts();
        modal.style.display = "none";
      }
    }
  });

  // Function to delete a blog post
  function deletePost(index) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      posts.splice(index, 1);
      savePostsToLocalStorage();
      displayPosts();
      modal.style.display = "none";
    }
  }

  // Initial display of posts
  displayPosts();
});

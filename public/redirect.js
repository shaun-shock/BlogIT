document.getElementById('createButton').addEventListener('click', function() {
    window.location.href = '/create';
});

document.getElementById('viewButton').addEventListener('click', function() {
    window.location.href = '/explore';
});

function redirectToBlog(index) {
    // Redirect to /blog/:index route where :index is the index of the blog to view
    window.location.href = `/blog/${index}`;
  }
  
  function fadeOutAndRedirect(index) {
    // Fade out the entire body
    document.body.classList.add('animate__animated', 'animate__fadeOut');

    // After a short delay, navigate to the blog page with the specific index
    setTimeout(function() {
        window.location.href = '/blog/' + index;
    }, 500); // Adjust the delay as needed to match the animation duration
}
function fadeOutAndRedirectMy(index) {
    // Fade out the entire body
    document.body.classList.add('animate__animated', 'animate__fadeOut');

    // After a short delay, navigate to the blog page with the specific index
    setTimeout(function() {
        window.location.href = '/my-blog/' + index;
    }, 500); // Adjust the delay as needed to match the animation duration
}

function fadeOutAndRedirectEdit(index) {
    // Fade out the entire body
    document.body.classList.add('animate__animated', 'animate__fadeOut');

    // After a short delay, navigate to the blog page with the specific index
    setTimeout(function() {
        window.location.href = '/edit/' + index;
    }, 500); // Adjust the delay as needed to match the animation duration
}

function confirmDelete(index) {
    console.log(`Delete button clicked for index ${index}`);
    if (confirm("Are you sure you want to delete this blog?")) {
      document.getElementById(`deleteForm${index}`).submit();
    } else {
      return false;
    }
  }

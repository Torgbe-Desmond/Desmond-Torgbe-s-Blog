document.addEventListener('DOMContentLoaded', function() {
  // Handle search button functionality
  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  // Add click event to all search buttons
  allButtons.forEach(button => {
    button.addEventListener('click', function() {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  });

  searchClose.addEventListener('click', function() {
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', 'false');
  });

  // const fullUrl = window.location.href.split('/');
  // const lastItem = fullUrl[fullUrl.length - 1].toLowerCase();

  // console.log('lastItem', lastItem);
  
  // const randomPerson = ['about', 'contact', ''];

  // if (!randomPerson.includes(lastItem)) {
  //   const messageLink = document.querySelector('a[href="/messages"]').parentElement;
  //   console.log('messageLink',messageLink)
  //   if (!randomPerson.includes((messageLink))) {
  //     messageLink.classList.remove('hide');
  //     messageLink.classList.add('show');
  //   }
  // }
});


document.getElementById('contactForm').addEventListener('submit', async function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
      data[key] = value;
  });

  try {
      const response = await fetch('/contact-me', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (response.ok) {
          document.getElementById('responseMessage').textContent = 'Message sent successfully!';
          this.reset(); 
      } else {
          document.getElementById('responseMessage').textContent = 'Failed to send message. Please try again.';
      }
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('responseMessage').textContent = 'An error occurred. Please try again later.';
  }
});







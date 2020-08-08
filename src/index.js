let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  let addBtn = document.querySelector("#new-toy-btn");
  let toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

////////////////// Helper METHOD ///////////////////

// a). selects the div with id tag toy-collection 
//  so we can latter appends some stuff to it.
let toyCollection = document.querySelector("#toy-collection")
// b). selects the toy form so we can latter POST
//  some toys to db.json
let toyForm = document.querySelector(".add-toy-form")




// 1). this fetches the JSON and iterates over each element(toy)  GET REQUEST
fetch('http://localhost:3000/toys')
.then(response => response.json())
.then(data => {
  // a). iterate over the json 
  data.forEach(toy => {
    // b). call helper function to create toy for each instance  
    addToyToDom(toy)  
  });
})

// 2).  There is a Helper method on top called toyCollection,  This builds the structure and appends it to the appropiate <div>.  it is also a helper method for the fetch right above.
let addToyToDom = (toy) => {
  /// 1). Creates the div with className: card <div class="card">
  let toyDiv = document.createElement('div')
    toyDiv.className = "card"

    // a). Creates the h2 tag with a string of toy.name <h2>Woody</h2>
    //  it appends it to the div
    let toyName = document.createElement('h2')
      toyName.innerText = toy.name
      toyDiv.append(toyName)
    
    // b). Creates the img tag with a className: toy-avatar
    // and a src link to toy.img 
    // <img src=toy_image_url class="toy-avatar" />
    // it appends it to the div
    let toyImage = document.createElement('img')
      toyImage.className = "toy-avatar"
      toyImage.src = toy.image
      toyDiv.append(toyImage)

    //c). Creates a p tag with a string `${interpolation}` of toy.likes
    //<p>4 Likes </p>
    //it appends it to the div
    let toyLikes = document.createElement('p')
      toyLikes.innerText = `${toy.likes} Likes`
      toyDiv.append(toyLikes)
  
    //d). Creates button with className: like-btm and string
    //  it has a className: like-btn
    // <button class="like-btn">Like <3</button>
    // it appends to the div
    let toyButton = document.createElement('button')
      toyButton.className = "like-btn"
      toyButton.innerText = `Like <3`
      toyDiv.append(toyButton)

  //Finaly everything is appended to the toyCollection Helper method.    
  toyCollection.append(toyDiv)

  // add an Event Listener to the <3 button above... which works as a HELPER METHOD
  toyButton.addEventListener("click", (evt) =>{
    //rinse and repeat
    //console.log(toy)
    //console.log(toyDiv)

    // Update the pobject in memory
    toy.likes += 1

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likes: toy.likes
      })
    })
    .then(res => res.json())
    .then((updatedToy) => {
      //updates what the user sees on the DOM
      toyLikes.innerText = `${updatedToy.likes} Likes`
    })
  })
}

toyForm.addEventListener("submit", (evt) => {
  evt.preventDefault()
  let toyName = evt.target.name.value
  let toyImg = evt.target.image.value

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-type": "Application/json"
    },
    body: JSON.stringify({
      name: toyName,
      image: toyImg,
      likes: 0
    })
  })
    .then(res => res.json())
    .then((newlyCreatedToy) => {
      addToyToDom(newlyCreatedToy)
      evt.target.reset()
    })
})


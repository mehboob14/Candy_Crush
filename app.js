document.addEventListener("DOMContentLoaded", () => {
  let grid = document.querySelector(".grid");
  let width = 8;
  let squares = [];
  let score = 0;

  const candyColors = [
    { color: "red", icon: "fa-solid fa-apple-alt" },
    { color: "yellow", icon: "fa-solid fa-lemon" },
    { color: "blue", icon: "fa-solid fa-water" },
    { color: "green", icon: "fa-solid fa-leaf" },
    { color: "purple", icon: "fa-solid fa-grapes" },
    { color: "orange", icon: "fa-solid fa-carrot" },
  ];

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      let randomIndex = Math.floor(Math.random() * candyColors.length);
      let randomCandy = candyColors[randomIndex];

      square.style.backgroundColor = randomCandy.color;

      // square.innerHTML = `<span style="font-size: 30px;">${randomCandy.icon}</span>`;
      // square.innerHTML = `<i class="fas fa-apple-alt" style="font-size: 24px;"></i>`;
      square.innerHTML = `<i class="${randomCandy.icon}"></i>`;


      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard();
  validateCandyColors();
  let colorBeingDragged;
  let colorBeingReplaced;
  let colorIdBeingDragged;
  let colorIdBeingReplaced;


  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));


  function dragStart() {
    colorBeingDragged = this.style.backgroundColor;
    colorIdBeingDragged = parseInt(this.id);
    innerHTMLBeingDragged = this.innerHTML;
    console.log(`Drag Start: ID=${this.id}, Color=${colorBeingDragged}`);
  }

  function dragOver(e) {
    e.preventDefault();
    console.log(`Drag Over: ID=${this.id}`);
  }

  function dragEnter() {
    console.log(`Drag Enter: ID=${this.id}`);
  }

  function dragLeave() {
    console.log(`Drag Leave: ID=${this.id}`);
  }

  function dragDrop() {

    colorBeingReplaced = this.style.backgroundColor;
    colorIdBeingReplaced = parseInt(this.id);
    innerHTMLBeingReplaced = this.innerHTML;
    console.log(
      `Drag Drop: Dragged ID=${colorIdBeingDragged}, Replaced ID=${colorIdBeingReplaced}`
    );

    if(dropAble(colorIdBeingDragged,colorIdBeingReplaced)){


    squares[colorIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    squares[colorIdBeingReplaced].style.backgroundColor = colorBeingDragged;
    squares[colorIdBeingDragged].innerHTML = innerHTMLBeingReplaced;
    squares[colorIdBeingReplaced].innerHTML = innerHTMLBeingDragged;

    // let temp = squares[colorIdBeingDragged].innerHTML;
    // squares[colorIdBeingDragged].innerHTML = squares[colorBeingReplaced].innerHTML;
    // squares[colorIdBeingReplaced].innerHTML = temp;
   checkAndProcessMatches();
  }
}

  function dropAble(draggedInd,ReplacedInd){
      if(ReplacedInd == draggedInd+1){
        return true;
      }else if (ReplacedInd == draggedInd-1){
        return true;
      }else if(ReplacedInd == draggedInd+8){
        return true;
      }else if(ReplacedInd == draggedInd-8){
        return true;
      }else{
        return false;
      }
  }

  function dragEnd() {
    console.log(`Drag End: ID=${this.id}`);
  }

  squares.forEach(square => {
    console.log(square)
  });


  function crushCandy(){
   let matchesFound = false;
    for(let i = 0;i<64;i++){ 
      if(i % 8 < 6){ 
        let candy1 = squares[i].style.backgroundColor;
        let candy2 = squares[i+1].style.backgroundColor;
        let candy3 = squares[i+2].style.backgroundColor;

        if(candy1 === candy2 && candy2 ===candy3 && candy1 !==''){
          matchesFound = true;
          squares[i].classList.add("matched");
          squares[i+1].classList.add("matched");
          squares[i+2].classList.add("matched");
        }
      }
    }

    //for columns
    for(let i = 0;i<48;i++){
      let candy1 = squares[i].style.backgroundColor;
      let candy2 = squares[i+8].style.backgroundColor;
      let candy3 = squares[i+16].style.backgroundColor;

      if(candy1 === candy2 && candy2 ===candy3 && candy1 !==''){
        matchesFound = true;
        squares[i].classList.add("matched");
        squares[i+8].classList.add("matched");
        squares[i+16].classList.add("matched");
      }
    }
    if(matchesFound){
      
      setTimeout(clearMatchedCandies,500);
    }
  }

  function validateCandyColors() {
    squares.forEach(square => {
      if (!square.style.backgroundColor) {
        const randomIndex = Math.floor(Math.random() * candyColors.length);
        const randomCandy = candyColors[randomIndex];
        square.style.backgroundColor = randomCandy.color;
        square.innerHTML = `<i class="${randomCandy.icon}"></i>`;
      }
    });
  }
  

  function clearMatchedCandies() {
    squares.forEach((square) => {
      if (square.classList.contains("matched")) {
        square.style.backgroundColor = "";
        square.innerHTML = "";
        square.classList.remove("matched");
      }
    });
  }

  function dropCandies() {
    for (let i = width * width - 1; i >= 0; i--) {
      if (squares[i].style.backgroundColor === "") {
        if (i >= width) {
          squares[i].style.backgroundColor = squares[i - width].style.backgroundColor;
          squares[i].innerHTML = squares[i - width].innerHTML;
          squares[i - width].style.backgroundColor = "";
          squares[i - width].innerHTML = "";
        } else {
          const randomIndex = Math.floor(Math.random() * candyColors.length);
          const randomCandy = candyColors[randomIndex];
          squares[i].style.backgroundColor = randomCandy.color;
          squares[i].innerHTML = `<i class="${randomCandy.icon}"></i>`;
        }
      }
    }
  }

  function checkAndProcessMatches() {
    crushCandy();
    if (document.querySelectorAll(".matched").length > 0) {
      setTimeout(() => {
        clearMatchedCandies();
        dropCandies();
        checkAndProcessMatches();
      }, 350);
    }
  }

  checkAndProcessMatches();
});

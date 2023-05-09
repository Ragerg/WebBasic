function change(choice) {
  const list = document.querySelectorAll("li");
  list.forEach((item) => {
    item.classList.remove("choice");
  });
  choice.className = "choice";
}
function input() {
  let text = prompt("텍스트를 입력해 주세요.");
  checkInput(text);
}

function checkInput(text) {
  if (text === null || text.length <= 0) {
    alert("텍스트값을 입력해 주세요");
  } else {
    document.getElementById("text").innerHTML = text;
    document.getElementById("button").innerHTML =
      "<input type=button value=빨강 onclick=changeColor('red')> <input type=button value=파랑 onclick=changeColor('blue')> <input type=button value=초록 onclick=changeColor('green')>";
  }
}

function changeColor(color) {
  text.style.color = color;
  if (color === "red") {
    color = "빨강";
  } else if (color === "blue") {
    color = "파랑";
  } else {
    color = "초록";
  }
  alert(color + "색으로 변경됩니다");
}

function getNum() {
  let input = prompt("숫자를 입력하세요");
  checkNum(input);
}

function checkNum(input) {
  if (isNaN(input)) {
    alert("입력한 값은 숫자가 아닙니다.");
  } else if (1 <= input && input <= 100) {
    for (let i = 1; i <= 100; i++) {
      console.log(i);
      if (i === 100) {
        alert("완료되었습니다.");
      }
    }
  } else {
    alert("1이상 100 이하의 숫자를 넣어주세요");
  }
}

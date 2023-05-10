$(function () {
  let text = null;
  while (text === null || text.length === 0) {
    text = prompt("텍스트값을 입력해 주세요");
  }
  $("#text").html(text);
  $("button")
    .css("display", "inline-block")
    .click(function () {
      let change = $(this).text();
      $("#text").css("color", change);
      if (change === "RED") {
        change = "빨강";
      } else if (change === "BLUE") {
        change = "파랑";
      } else {
        change = "초록";
      }
      alert(change + "색으로 변경됩니다");
    });
});

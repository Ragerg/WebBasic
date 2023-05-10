$(function () {
  $("button").click(function () {
    let name = prompt("기자 이름을 입력해 주세요");

    if (name !== null) {
      let text = prompt("기사 내용을 입력해 주세요");
      if (text !== null) {
        $("section").append(
          "<div class='box'><b>" +
            name +
            "</b>&nbsp;&nbsp;&nbsp;" +
            text +
            "<br><div>"
        );
      }
    }
  });
});

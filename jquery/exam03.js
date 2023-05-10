$(function () {
  $("li").click(function () {
    $("li").removeClass("choice");
    $(this).addClass("choice");
  });
});

const ENEMY_SPEED_MIN_EASY = 1000;
const ENEMY_SPEED_MAX_EASY = 3000;

const ENEMY_SPEED_MIN_HARD = 500;
const ENEMY_SPEED_MAX_HARD = 1000;

$(function () {
  const hero = $("#hero");
  const enemy = $("#enemy");
  const pang = $("#pang");

  //배경 움직이게
  function backgroundSlide() {
    let posi = 0;

    setInterval(function () {
      $("#container").css("background-position", posi-- + "px");
      if (posi === -880) {
        posi = 0;
      }
    }, 10);
  }

  // 점프 중인지?
  let isJumping = false;
  let score = 0;
  let isLaunching = false;

  gameStart();

  function gameStart() {
    // $('#gameover_screen').hide();

    setKeyboardEvent();
    enemyStart();

    checkGameOver();
    backgroundSlide();
  }

  //캐릭터가 적과 충돌
  function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
      rect1.bottom < rect2.top + 10 ||
      rect1.top > rect2.bottom + 10 ||
      rect1.right < rect2.left + 10 ||
      rect1.left > rect2.right + 10
    );
  }

  function checkGameOver() {
    setInterval(function () {
      if (isColliding(hero[0], enemy[0])) {
        hero.stop();
        enemy.stop();

        if (!$("#gameover_screen").is(":visible")) {
          square();
          $("#gameover_screen").show();
          $("#score").css("display", "none");
        }
      }
    }, 1000 / 60);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function square() {
    // let colors = ["#ff0000", "#0000ff", "#00ff00"];
    // let colors = ["#c7339b90", "#7ac73390", "#c4d01d1b", "#1d29d01b"];
    let colors = ["#7ac733d8", "#c7339be1", "#c4d01dc5", "#1d29d0da"];

    $(".square").each(function () {
      let top = getRandomNumber(-100, 300) + "px";
      let left = getRandomNumber(-300, 500) + "px";
      let color = colors[Math.floor(Math.random() * colors.length)];

      $(this).css("top", top);
      $(this).css("left", left);
      $(this).css("background-color", color);
    });
  }

  function enemyStart() {
    // 속도 조절
    const speed = getRandomNumber(1000, 3000);

    // 적이 오른쪽에서 왼쪽으로 이동
    enemy.animate({ right: "850px" }, speed, "linear", function () {
      // 점수 올리자
      score += 100;
      updateScore(score);

      // 적 리셋
      enemy.css("right", "-50px");
      enemyStart();
    });
  }

  function updateScore(score) {
    $("#score").text("Score : " + score);
    $("#finalScore").text("Score : " + score);
  }

  function jump() {
    isJumping = true;
    hero
      .animate({ bottom: "+=140px" }, 500)
      .animate({ bottom: "-=140px" }, 800, function () {
        isJumping = false;
      });
  }

  // 펭귄이 캐릭터에서 오른쪽으로 이동
  function attack() {
    isLaunching = true;
    pang.animate({ left: "900px" }, 700, "linear").css("display", "block");
  }

  // 키보드 이벤트 정의
  function setKeyboardEvent() {
    $("html").keydown(function (e) {
      switch (e.key) {
        case " ":
          if (!isJumping) {
            jump();
          }
          break;
        case "ArrowRight":
          if (!isJumping && !isLaunching) {
            attack();
          }
      }
      // console.log(e.key);
    });
  }
});

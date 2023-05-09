// 이름을 입력 받고
function getName() {
   // let name = prompt('이름을 입력해 주세요');
   const name = prompt('이름을 입력해 주세요'); // 지금 코드에서는 이름이 바뀔 일이 없으니 const가 더 좋다
   checkName(name);
}

function checkName(name) {
    // 이름이 입력되지 않거나 취소를 눌렀을 때 다시 입력받고
    if(name === '' || name === null) {
        getName();
      // 이름이 입력되었을 때 로그에 이름을 띄우고, 경고창으로 '누구누구님 안녕하세요' 띄우기  
    } else {
        console.log(name);
        alert(name + "님 안녕하세요");
    }
}
todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    var data = {
      name: todoForm.name.value,
    };


    console.log('window.dbRefUsers => ', window.dbRefUsers().ref("users").child(Math.random()));
    console.log('data => ', data);

    var postListRef = window.dbRefUsers().ref("users")
    var newPostRef = postListRef.push();

    newPostRef.set(data)
    .then(function () {
      console.log('Tarefa "' + data.name + '" adicionada com sucesso');
    });
    
  } else {
    alert("O nome da tarefa não pode ser em branco para criar a tarefa!");
  }
};

var ulTodoList = document.getElementById('ulTodoList')
var todoForm = document.getElementById('todoForm')
var todoCount = document.getElementById('todoCount')

todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    var data = {
      name: todoForm.name.value,
    };

    var postListRef = window.dbRefUsers().ref("users")
    var newPostRef = postListRef.push();

    newPostRef.set(data)
    .then(function () {
      postListRef.on('value', function (dataSnapshot) {
        fillTodoList(dataSnapshot)
      })
    });

  } else {
    alert("O nome da tarefa não pode ser em branco para criar a tarefa!");
  }
};


// Exibe a lista de tarefas do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = ''
  var num = dataSnapshot.numChildren()
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':' // Exibe na interface o número de tarefas
  dataSnapshot.forEach(function (item) { // Percorre todos os elementos
    var value = item.val()
    var li = document.createElement('li') // Cria um elemento do tipo li
    var spanLi = document.createElement('span') // Cria um elemento do tipo span
    spanLi.appendChild(document.createTextNode(value.name)) // Adiciona o elemento de texto dentro da nossa span
    spanLi.id = item.key // Define o id do spanLi como a chave da tarefa
    li.appendChild(spanLi) // Adiciona o span dentro do li

    var liRemoveBtn = document.createElement('button') // Cria um botão para a remoção da tarefa
    liRemoveBtn.appendChild(document.createTextNode('Excluir')) // Define o texto do botão como 'Excluir'
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")') // Configura o onclick do botão de remoção de tarefas
    liRemoveBtn.setAttribute('class', 'danger todoBtn') // Define classes de estilização para o nosso botão de remoção
    li.appendChild(liRemoveBtn) // Adiciona o botão de remoção no li
    ulTodoList.appendChild(li) // Adiciona o li dentro da lista de tarefas
  })
}

// Remove tarefas 
window.removeTodo = (key) => {
  var selectedItem = document.getElementById(key)
  var confimation = confirm('Realmente deseja remover a tarefa \"' + selectedItem.innerHTML + '\"?')
  if (confimation) {
    window.dbRefUsers().ref("users").child(key).remove().catch(function (error) {
      showError('Falha ao remover tarefa: ', error)
    })
  }
}
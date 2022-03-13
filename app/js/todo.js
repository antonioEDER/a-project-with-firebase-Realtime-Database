import firebase from "firebase";

var ulTodoList = document.getElementById('ulTodoList')
var todoForm = document.getElementById('todoForm')
var todoCount = document.getElementById('todoCount')

todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    var data = {
      name: todoForm.name.value,
    };

    var postListRef = window.dbRefUsers().ref("users").child(firebase.auth().currentUser.uid)
    var newPostRef = postListRef.push();

    newPostRef.set(data)
    .then(function () {
      OnDataBase()
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

    var liUpdateBtn = document.createElement('button') // Cria um botão para a atualização da tarefa
    liUpdateBtn.appendChild(document.createTextNode('Editar')) // Define o texto do botão como 'Editar'
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")') // Configura o onclick do botão de atualização de tarefas
    liUpdateBtn.setAttribute('class', 'alternative todoBtn') // Define classes de estilização para o nosso botão de atualização
    li.appendChild(liUpdateBtn) // Adiciona o botão de atualização no li

    ulTodoList.appendChild(li) // Adiciona o li dentro da lista de tarefas
  })
}

function OnDataBase() {
  console.log('firebase.auth().currentUser', firebase.auth().currentUser);
  var postListRef = window.dbRefUsers().ref("users").child(firebase.auth().currentUser.uid)
  postListRef.on('value', function (dataSnapshot) {
    fillTodoList(dataSnapshot)
  })
}

// Remove tarefas 
window.removeTodo = (key) => {
  var selectedItem = document.getElementById(key)
  var confimation = confirm('Realmente deseja remover a tarefa \"' + selectedItem.innerHTML + '\"?')
  if (confimation) {
    window.dbRefUsers().ref("users").child(firebase.auth().currentUser.uid).child(key).remove().catch(function (error) {
      showError('Falha ao remover tarefa: ', error)
    })
  }
}

// Atualiza tarefas
window.updateTodo = (key) => {
  var selectedItem = document.getElementById(key)
  var newTodoName = prompt('Escolha um novo nome para a tarefa \"' + selectedItem.innerHTML + '\".', selectedItem.innerHTML)
  if (newTodoName != '') {
    var data = {
      name: newTodoName
    }

    window.dbRefUsers().ref("users").child(firebase.auth().currentUser.uid).child(key).update(data).then(function () {
      console.log('Tarefa "' + data.name + '" atualizada com sucesso')
    }).catch(function (error) {
      alert('Falha ao atualizar tarefa: ', error)
    })
  } else {
    alert('O nome da tarefa não pode ser em branco para atualizar a tarefa')
  }
}

window.OnDataBase = OnDataBase
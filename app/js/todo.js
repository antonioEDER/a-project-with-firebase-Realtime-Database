import firebase from "firebase";

var ulTodoList = document.getElementById('ulTodoList')
var todoForm = document.getElementById('todoForm')
var todoCount = document.getElementById('todoCount')
var progress = document.getElementById('progress')
var progressFeedback = document.getElementById('progressFeedback')
progressFeedback.style.display = "none";

todoForm.onsubmit = function (event) {
  event.preventDefault(); // Evita o redirecionamento da página
  if (todoForm.name.value != "") {
    var file = todoForm.file.files[0] // Seleciona o primeiro aquivo da seleção de aquivos
    if (file != null) { // Verifica se o arquivo foi selecionado
      if (file.type.includes('image')) { // Verifica se o arquivo é uma imagem
        // Compõe o nome do arquivo
        var imgName = firebase.database().ref().push().key + '-' + file.name
        // Compõe o caminho do arquivo
        var imgPath = 'todoListFiles /' + firebase.auth().currentUser.uid + '/' + imgName

        // Cria uma referência de arquivo usando o caminho criado na linha acima
        var storageRef = firebase.storage().ref(imgPath)
        
        // Inicia o processo de upload
        var upload = storageRef.put(file)

        trackUpload(upload).then(function () {
          storageRef.getDownloadURL().then(function (downloadURL) {
            console.log('downloadURL', downloadURL);
            var data = {
              imgUrl: downloadURL,
              name: todoForm.name.value,
              nameLowerCase: todoForm.name.value.toLowerCase()
            }
  
            window.dbRefUsers().ref("users").child(firebase.auth().currentUser.uid).push(data).then(function () {
              console.log('Tarefa "' + data.name + '" adicionada com sucesso')
            }).catch(function (error) {
              showError('Falha ao adicionar tarefa (use no máximo 30 caracteres): ', error)
            })
  
            todoForm.name.value = ''
            todoForm.file.value = ''
          })      
        }).catch(function (error) {
          showError('Falha ao adicionar tarefa: ', error)
        })
      } else {
        alert('O arquivo selecionado precisa ser uma imagem. Tente novamente')
      }
    }
    
    var data = {
      name: todoForm.name.value,
      ameLowerCase: todoForm.name.value.toLowerCase()
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

    var imgLi = document.createElement('img') // Cria um elemento img
    imgLi.style.height = '50px'
    imgLi.style.width = '50px'
    // Configura src (origem da imagem) como sendo o imgUrl da tarefa
    imgLi.src = value.imgUrl ? value.imgUrl : 'https://toppng.com/uploads/preview/icone-homem-man-icon-11553494437bgj8eja2bq.png'
    imgLi.setAttribute('class', 'imgTodo') // Defini classes de estilização
    li.appendChild(imgLi) // Adiciona o img dentro do li

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
      name: newTodoName,
      nameLowerCase: newTodoName.toLowerCase()
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

function trackUpload(upload) {
  progressFeedback.style.display = "block";
  upload.on('state_changed',
    function (snapshot) { // Segundo argumento: Recebe informações sobre o upload
      console.log(snapshot.bytesTransferred / snapshot.totalBytes * 100 + '%')
      progressFeedback.innerHTML = `${snapshot.bytesTransferred / snapshot.totalBytes * 100}%`
    }, function (error) { // Terceiro argumento: Função executada em caso de erro no upload
      alert(error, 'Falha no upload da imagem')
    },
    function () { // Quarto argumento: Função executada em caso de sucesso no upload
      console.log('Sucesso no upload')
      // progressFeedback.style.display = "none";
    })
}



// Rastreia o progresso de upload
function trackUpload(upload) {
  return new Promise(function (resolve, reject) {
    progressFeedback.style.display = "block";
    upload.on('state_changed',
      function (snapshot) { // Segundo argumento: Recebe informações sobre o upload
        console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%')
        progressFeedback.innerHTML = `${snapshot.bytesTransferred / snapshot.totalBytes * 100}%`
      }, function (error) { // Terceiro argumento: Função executada em caso de erro no upload
        reject(error)
      },
      function () { // Quarto argumento: Função executada em caso de sucesso no upload
        console.log('Sucesso no upload')
        progressFeedback.style.display = "block";
        resolve()
      })
  })
}


window.OnDataBase = OnDataBase
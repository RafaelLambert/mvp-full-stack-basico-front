/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de students existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getStudentList = async () => {
  // Limpa a tabela antes de inserir novos dados 
  // const tableBody = document.getElementById("studentTable");
  // tableBody.innerHTML = ""
    let url = 'http://127.0.0.1:5000/students';

    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        clearTableRows();
        data.students.forEach(item => insertList(
            item.id,
            item.name,
            item.cpf,
            item.enrollment,
            item.grade_level,
            item.grade_1,
            item.grade_2,
            item.grade_3,
            item.grade_4,
            item.final_average))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar estudantes pelo nome
  --------------------------------------------------------------------------------------
*/
const getStudentByName = async () => {
  const studentName = document.getElementById('searchInput').value.trim();

  if (!searchInput) {
      alert("Please enter a name to search!");
      getStudentList();
      return;
  }

  const url = `http://127.0.0.1:5000/student?name=`+ encodeURIComponent(studentName);
  try{
    const response = await fetch(url, {
      method: 'get'
    });
    if(response.status === 200){
      response.json().then((data) => {
        clearTableRows();
        insertList(
          data.id,
          data.name,
          data.cpf,
          data.enrollment,
          data.grade_level,
          data.grade_1,
          data.grade_2,
          data.grade_3,
          data.grade_4,
          data.final_average
        );
      })
    }else if(response.status === 404){
      alert("No students found with the given name.");
      clearSearch();
    }
  }catch(error){
    console.error('Error:', error);
    alert("An error occurred while searching for students.");
  }

};

/*
  --------------------------------------------------------------------------------------
  Função para colocar um student na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postStudent = async (inputName, inputCpf, inputGradeLevel) => {
  const formData = new FormData();
  formData.append('name', inputName);
  formData.append('cpf', inputCpf);
  formData.append('grade_level', inputGradeLevel);

  console.log("FormData being sent:");
  for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
  }

  let url = 'http://127.0.0.1:5000/student';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    console.log(response.status);
    if (response.ok) {
      alert("Student added successfully!");
      getStudentList();
    } else if (response.status === 409) {
      alert("Cpf already been added!");
    } else if (response.status === 400) {
      const errorData = await response.json();
      alert(`Error: ${errorData.message || 'Bad request'}`);
    } else {
      alert("Student not added. Try again.");
    }
      clearStudentFormInputs();
  } catch (error) {
    console.error('Error:', error);
    alert("Error trying to add the student. Please try again later.");
  }

  clearStudentFormInputs();
};

/*
  --------------------------------------------------------------------------------------
  Função para Alterar um student da lista do servidor via requisição Put
  --------------------------------------------------------------------------------------
*/
const putStudent = async (studentName, inputGrade1, inputGrade2, inputGrade3, inputGrade4) => {

  const formData = new FormData();

  formData.append('grade_1', inputGrade1);
  formData.append('grade_2', inputGrade2);
  formData.append('grade_3', inputGrade3);
  formData.append('grade_4', inputGrade4);

  const url = 'http://127.0.0.1:5000/student?name=' + encodeURIComponent(studentName);

  fetch(url, {
    method: 'put',
    body: formData
  })
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um student da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteStudent = (studentName) => {
  
  let url = 'http://127.0.0.1:5000/student?name=' + encodeURIComponent(studentName);
  fetch(url, {
    method: 'delete'
  })
  .then((response) => response.json())
  .catch((error) => {
    console.error('Error:', error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar o campo de busca e exibir todos os estudantes
  --------------------------------------------------------------------------------------
*/
const clearSearch = () => {
  document.getElementById('searchInput').value = ""; // Limpa o campo de busca
  getStudentList(); // Retorna todos os estudantes
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão com evento
  --------------------------------------------------------------------------------------
*/
const createButton = (text, className, onClickAction) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.onclick = onClickAction;
  return button;
};


/*
  --------------------------------------------------------------------------------------
  Função para inserir os botões de save e delete, com suas respectivas funções, para cada student da lista
  --------------------------------------------------------------------------------------
*/
const insertButtons = (parent, studentId,studentName) => {
  // Criação do botão salvar
  const saveButton = createButton("Save", "save-btn", () => {
      if (confirm("Salvar novas notas?")) {
          handleSaveAction(studentId, studentName);
      }
  });

  // Criação do botão excluir
  const deleteButton = createButton("Delete", "delete-btn", () => {
      if (confirm("Você tem certeza?")) {
          handleDeleteAction(studentName, parent.parentElement);
      }
  });

  // Adicionar botões ao elemento pai
  parent.appendChild(saveButton);
  parent.appendChild(deleteButton);
};

/*
  --------------------------------------------------------------------------------------
  Função para salvar alterações (chamada no evento do botão Save)
  --------------------------------------------------------------------------------------
*/
const handleSaveAction = (studentId,studentName) => {
  const grades = [...document.querySelectorAll(`[id^="grade"][id$="_${studentId}"]`)].map(input => input.value);

  if (grades.every(isValidGrade)) {
      putStudent(studentName, ...grades);
      alert("Grades saved successfully!");
  } else {
      alert("Please enter valid grades (0 to 10) before saving.");
      
  }
  getStudentList();
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar aluno (chamada no evento do botão Delete)
  --------------------------------------------------------------------------------------
*/
const handleDeleteAction = (studentName, rowElement) => {
  if (confirm("Are you sure you want to delete this student?")) {
    deleteStudent(studentName);
    rowElement.remove();
    alert("Student removed successfully!");
    getStudentList();
}
};

 
/*
  --------------------------------------------------------------------------------------
  Função para preparar o formulário de cadastro do studnet
  --------------------------------------------------------------------------------------
*/
const postStudentForm = async () => {
  let inputName = document.getElementById('name').value.trim();
  let inputCpf = document.getElementById('cpf').value.trim();
  let inputGradeLevel = document.getElementById('grade-level').value.trim();

  

  const isNumericCPF = (cpf) => /^\d+$/.test(cpf);


  if (!inputName) {
    alert("Please, enter the student's name!");
    return;
  } 
  if(!isNumericCPF(inputCpf)){
    alert("Please, CPF must contain only numbers")
    return;
  }
  if (!isValidCPF(inputCpf)){
    alert("Please, enter a valid CPF")
    return;
  }
  if(inputGradeLevel == 'select'  ){
    alert("Please, select the student's grade level.");
    return;
  } 
  inputCpf = inputCpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  postStudent(inputName, inputCpf, inputGradeLevel);  
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, name, cpf, gradeLevel, enrollment, grade1, grade2, grade3, grade4, finalGrade) => {
  const table = document.getElementById("studentTable");
  const row = table.insertRow();
  row.setAttribute("tabindex", "0")

  // Adiciona células de texto com os dados do aluno
  const studentData = [name, cpf, gradeLevel, enrollment];
  studentData.forEach(data => {
      const cell = row.insertCell();
      cell.textContent = data;
      cell.setAttribute("tabindex", "0");
  });

  // Adiciona células de input para as notas
  [grade1, grade2, grade3, grade4].forEach((grade, index) => {
      const input = document.createElement("input");
      input.id = `grade${index + 1}_${id}`;
      input.className = "student-grade";
      input.type = "number";
      input.min="0" 
      input.max="10" 
      input.step="0.01" 
      input.required 
      input.title="A nota deve estar entre 0 e 10."
      input.value = grade;
      row.insertCell().appendChild(input);
  });

  // Adiciona a nota final
  const finalGradeCell = row.insertCell();
  finalGradeCell.textContent = finalGrade;
  finalGradeCell.setAttribute("tabindex", "0");

  // Adiciona os botões de ação
  const actionsCell = row.insertCell();
  insertButtons(actionsCell, id, name);

  // Limpa os campos do formulário
  clearStudentFormInputs();
};

const isValidCPF = (cpf) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica se o CPF tem 11 dígitos ou é uma sequência repetida (ex.: "11111111111")
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
  }

  // Valida os dígitos verificadores
  const calcDigit = (base) => {
      let sum = 0;
      for (let i = 0; i < base; i++) {
          sum += parseInt(cpf[i]) * (base + 1 - i);
      }
      const digit = sum % 11;
      return digit < 2 ? 0 : (11-digit);
  };

  const digit1 = calcDigit(9);
  const digit2 = calcDigit(10);

  return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const isValidGrade = (grade) => {
  const num = parseFloat(grade);
  return !isNaN(num) && num >= 0 && num <= 10;
};

const clearTableRows = () => {
  const table = document.getElementById('studentTable');  // Substitua 'myTable' pelo id da sua tabela
  const rows = table.getElementsByTagName('tr');

  // Começa do índice 1 para não remover o título (primeira linha)
  for (let i = rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }
};

const clearStudentFormInputs = () => {
  document.getElementById("name").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("grade-level").value = "select";
}

/*
--------------------------------------------------------------------------------------
Chamada da função para carregamento inicial dos dados
--------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
  // Chama o método para obter a lista de estudantes
  getStudentList();
});
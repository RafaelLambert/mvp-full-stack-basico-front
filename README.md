# mvp-full-stack-basico-front

Este é o Front-End do projeto MVP proposto pela PUC-RIO, que apresenta uma interface onde o usuário pode realizar operações HTTP para cadastrar, buscar, deletar e alterar os dados de um estudante.

O objetivo deste projeto é demonstrar habilidades de integração entre um Front-End e uma API REST (Também parte do Projeto MVP), utilizando requisições HTTP para manipular dados de um estudante.

---



## Estrutura do Projeto

### Arquivos Principais

1. `<span><strong>index.html</strong></span>`:
   * Estrutura da interface do usuário.
   * Contém os seguites elementos:
     * Um formulário para o cadastro de dados de um estudante.
     * Uma tabela de exibição dos dados de um ou todos estudantes cadastrados
     * Um campo para a consulta de um único estudante.
2. `<span><strong>style.css</strong></span>`:
   * Responsável pelo design e layout.
   * Estiliza componentes como formulários, tabelas e botões.
   * Utiliza Layouts como grid e flex para o posicionamento dos elementos na tela
3. `<span><strong>script.js</strong></span>`:
   * Contém as funções para interação com a API REST:
     * `<span>getStudentList</span>`: Busca todos os estudantes.
     * `<span>getStudentByName</span>`: Busca um estudante pelo nome.
     * `<span>postStudent</span>`: Adiciona um novo estudante.
     * `<span>putStudent</span>`: Atualiza as notas de um estudante.
     * `<span>deleteStudent</span>`: Remove um estudante pelo nome.
   * Validações implementadas:
     * Formato do CPF.
     * Intervalo das notas (0 a 10).
   * Gerenciamento dinâmico da tabela de exibição.

---



## Como Executar o Projeto

1. Clone este repositório:

   ```
   git clone <https://github.com/RafaelLambert/mvp-full-stack-basico-front.git> 
   ```
2. Abra o arquivo index.html em um navegador.
3. Certifique-se de que a API REST esteja rodando localmente em http://127.0.0.1:5000.
4. Utilize a interface para realizar operações de CRUD nos estudantes.

   ---

## Requisitos

* Navegador moderno (Google Chrome, Firefox, Edge, etc.).
* Servidor da API REST configurado e em execução.

---



## Licença

Este projeto é de uso acadêmico e segue as diretrizes da PUC-RIO para projetos de ensino.

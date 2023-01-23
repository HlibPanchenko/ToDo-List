// Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList"); // ul
const emptyList = document.querySelector("#emptyList"); // li "Список дел пуст"
// const deleteButton = document.querySelector('.btn-action');

let tasks = [];

// при загрузке страницы проверяет есть ли что-то в LS, если есть - то отрисовываем

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  // console.log(tasks);
  // отрисуем на странице то, что лежит в LS
  tasks.forEach((el) => renderTask(el));
}

checkEmptyList(); // отрисовывать <li> "Список дел пуст" на основе того, пустой массив данных или нет

// Отслеживаем отправку форму (когда пользователь нажмет enter или нажмет кнопкуу "Добавить")
// Добавление задачи
form.addEventListener("submit", addTask);

function addTask(e) {
  e.preventDefault(); // чтобы при отправке формы не обновлялась страница
  //   console.log("listener works");

  // Получаем текст из inputa
  const taskText = taskInput.value;
  //   console.log(taskText);

  // очищаем поле ввода после отправки и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  // Добавляем задачу на страницу

  // 0) сформируем обьект, который будет описывать задачу для LS

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false, // по умолчанию задача не выполнена
  };

  // добавим этот обьект в массив с задачами

  tasks.push(newTask);
  console.log(tasks);

  saveToLocalStorage();

  //   // если newTask.done true, тогда добавим класс task-title--done
  //   const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  //   // 1) Получим в переменную разметку
  //   const taskHTML = `

  // 	<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
  // 	<span class="${cssClass}">${newTask.text}</span>
  // 	<div class="task-item__buttons">
  // 		<button type="button" data-action="done" class="btn-action">
  // 			<img src="./img/tick.svg" alt="Done" width="18" height="18">
  // 		</button>
  // 		<button type="button" data-action="delete" class="btn-action">
  // 			<img src="./img/cross.svg" alt="Done" width="18" height="18">
  // 		</button>
  // 	</div>
  // </li>`;

  //   // console.log(taskHTML);

  //   // 2) Добавим задачу на страницу, а именно в <ul>
  //   tasksList.insertAdjacentHTML("beforeend", taskHTML);

  renderTask(newTask);

  // Но у нас в разметке есть li, с надписью "Список дел пуст", его нам надо убрать, если есть задачи
  // Мой вариант
  //   tasksList.removeChild(emptyList);

  // Но лучше написать через проверку
  // Надо проверить есть ли какие-то задачи в списке
  // Свойство children хранит в себе псевдомассив дочерних элементов.
  // Проверяем на >1, потому что если даже список пуст, там будет один <li> - "Список дел пуст"
  // if (tasksList.children.length > 1) {
  //   //  tasksList.removeChild(emptyList); // Можно и так, это мой вариант
  //   emptyList.classList.add("none"); // навешиваем класс, внутри класса display: none;
  // }
  //   console.log(tasksList.children);

  // saveHTMLToLS();
  checkEmptyList();
}

// Удаление задачи из таск листа
// Так как изначально у нас на странице нету всех задач, то и слушатель мы не сможем повесить.
// Т.е. задачи на странице появляются после того как мы ее открыли
// мы не можем повесить слушателя на кнопку, до того как она появилась на странице
// Поэтому будем вешать слушатель на весь список задач (ul), и потом будем проверять если клик произошел на кнопке удалить, тогда будем удалять задачу

tasksList.addEventListener("click", deleteTask);

function deleteTask(event) {
  // console.log(event);
  // если нажали на кнопку закрыть...
  if (event.target.dataset.action == "delete") {
    console.log("I am delete button");
    // найдем какому li принадлежит эта кнопка
    // мой вариант
    // event.target.closest('li').classList.add('none'); // closest ищет ближайшего родителя
    // вариант с видео
    const nodeParent = event.target.closest("li");
    // console.log(nodeParent);

    // Определяем id задачи
    const id = Number(nodeParent.id); // все данные которые мы достаем из разметки, они все строки, поэтому приведем к числу

    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => {
      console.log(task);
      if (task.id === id) {
        return true;
      }
    });

    // console.log(index); // индекс задачи, которую нам надо удалить из массива

    // Удаляем задачу из массива
    tasks.splice(index, 1);
    console.log(tasks);

    saveToLocalStorage();

    nodeParent.remove();

    // добавляем <li> "Список дел пуст" когда мы удалили все таски
    // if (tasksList.children.length === 1) {
    //   emptyList.classList.remove("none"); // навешиваем класс, внутри класса display: none;
    // }
  }

  // saveHTMLToLS();
  checkEmptyList();
}

// отмечаем задачу завершенной
// опять будем слушать весь список

tasksList.addEventListener("click", doneTask);

function doneTask(e) {
  if (e.target.dataset.action == "done") {
    // когда задача отмечена выполненой, то она становится серой. Ищем span
    const parentNode = e.target.closest("li");
    const taskTitle = parentNode.querySelector("span"); // нашли span
    taskTitle.classList.toggle("task-title--done"); // когда таска отмечена как выполнена, текст внутри нее становится серым и зачеркнутым
    // console.log(taskTitle);
    // console.log('i am done');

    // определяем id задачи
    const id = parentNode.id;

    // находим эту задачу в массиве задач
    tasks.find((task) => {
      if (task.id == id) {
        task.done = !task.done; // работает как toggle, если тру - поменяет на фолс, и наоборот
        console.log(task);
      }
    });

    saveToLocalStorage();
  }

  // saveHTMLToLS();
}

// Работа с Local Storage

/**
 * Есть 2 варианта роботы с Local Storage: правильный и неправильный.
 *
 * 1)  Правильный
 *
 * Создать массив со всеми тасками, хранить в Local Storage только данные по таскам - названия задачи (можно еще статус).
 * И получая эти данные, рендерить их и отображать их на странице.
 *
 * \2)  неправильный, но быстрый
 *
 * хранить в Local Storage всю разметку, которую мы отображаем на странице
 *
 */

// Неправильный способ

// Чтобы что-то записать в Local Storage, используем localStorage.setItem('key', 'value')
// Чтобы получить - localStorage.getItem('key')

// будем вызывать эту функцию каждый раз когда добавляем или удаляем таску
// ЗАписываем в LS, то что лежит внутри <ul>
// setItem каждый раз перезаписывет значение
// function saveHTMLToLS() {
//   localStorage.setItem("tasksHTML", tasksList.innerHTML);
// }

// // когда заново открываем страницу, будем проверять есть ли у нас что-то в LS, если есть тогда отрисовываем
// if (localStorage.getItem("tasksHTML")) {
//   tasksList.innerHTML = localStorage.getItem("tasksHTML");
// }

// Правильный способ

//Создадим массив который будет содержать все задачи

// let tasks = [];

// Новая задача, которая создается, будет добавляться в этот массив. Когда удаляется задача - будем удалять с массива. Когда отмечается как выполнено, будет менять свой статус

// функция которая будет отрисовывать <li> "Список дел пуст" на основе того, пустой массив данных или нет

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

// функция которая будет записывать наш массив в LS

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  // когда мы хотим записать обьект или массив в LS, надо их перевести в json строку
}

// функция которая отрисовывает задачу на странице
function renderTask(task) {
  // если task.done true, тогда добавим класс task-title--done
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // 1) Получим в переменную разметку
  const taskHTML = `
	
	<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
	<span class="${cssClass}">${task.text}</span>
	<div class="task-item__buttons">
		<button type="button" data-action="done" class="btn-action">
			<img src="./img/tick.svg" alt="Done" width="18" height="18">
		</button>
		<button type="button" data-action="delete" class="btn-action">
			<img src="./img/cross.svg" alt="Done" width="18" height="18">
		</button>
	</div>
</li>`;

  // 2) Добавим задачу на страницу, а именно в <ul>
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

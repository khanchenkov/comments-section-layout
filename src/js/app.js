// -- когда в поле начинаем печатать, то ошибка исчезает

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".comments__form");
  const commentsList = document.querySelector(".comments__list");
  const usernameInput = form.querySelector("input[type=text]");
  const textarea = form.querySelector("textarea");
  const datepicker = form.querySelector("input[type=date]");
  const commentsCouter = document.getElementById("counter");
  const submitButton = form.querySelector("button");

  const nameInputError = form.querySelector(".comments__error-name");
  const textareaError = form.querySelector(".comments__error-textarea");

  // vars
  const possibleErrors = {
    noValue: "Вы не заполнили поле.",
    nameLength: "Имя не может быть короче 2 символов.",
    textAreaLength: "Сообщение не может быть больше 160 символов.",
  };
  let hasTriedComment = false;

  // funcs
  const editDate = (date) => {
    let tmpDate = new Date();
    const todayHours = `0${tmpDate.getHours()}`.slice(-2);
    const todayMinutes = `0${tmpDate.getMinutes()}`.slice(-2);
    const currentYear = tmpDate.getFullYear();
    const currentMonth = tmpDate.getMonth();
    const currentDate = tmpDate.getDate();

    if (
      date === "" ||
      (new Date(date).getFullYear() === currentYear &&
        new Date(date).getMonth() === currentMonth &&
        new Date(date).getDate() === currentDate)
    ) {
      return `сегодня, ${todayHours}:${todayMinutes}`;
    }

    const specifiedUserDate = new Date(date);
    const specifiedYear = specifiedUserDate.getFullYear();
    const specifiedMonth = specifiedUserDate.getMonth();
    const specifiedDate = specifiedUserDate.getDate();

    if (specifiedMonth === currentMonth && specifiedYear === currentYear) {
      if (currentDate - specifiedDate === 1) {
        return `вчера, ${todayHours}:${todayMinutes}`;
      }
      if (currentDate - specifiedDate === -1) {
        return `завтра, ${todayHours}:${todayMinutes}`;
      }
    }

    const [year, month, day] = date.split("-");

    return `${day}.${month}.${year}`;
  };

  const createListElement = (username, comment, date) => {
    const li = document.createElement("li");
    li.classList.add("user");

    li.innerHTML = `
        <div class="user__avatar"></div>
        <div class="user__comment">
          <a class="user__name" href="#">${username}</a>

          <p class="user__text">
            ${comment}
          </p>
            <div class="user__like">
              <div>
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 14L6.4125 12.9929C2.55 9.42997 0 7.07248 0 4.19619C0 1.83869 1.815 0 4.125 0C5.43 0 6.6825 0.617984 7.5 1.58692C8.3175 0.617984 9.57 0 10.875 0C13.185 0 15 1.83869 15 4.19619C15 7.07248 12.45 9.42997 8.5875 12.9929L7.5 14Z"
                    fill="#ccc"
                  />
                </svg>
                <svg
                  width="11"
                  height="14"
                  viewBox="0 0 11 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8889 0.777778H8.16667L7.38889 0H3.5L2.72222 0.777778H0V2.33333H10.8889M0.777778 12.4444C0.777778 12.857 0.941666 13.2527 1.23339 13.5444C1.52511 13.8361 1.92077 14 2.33333 14H8.55556C8.96811 14 9.36378 13.8361 9.6555 13.5444C9.94722 13.2527 10.1111 12.857 10.1111 12.4444V3.11111H0.777778V12.4444Z"
                    fill="#CCCCCC"
                  />
                </svg>
              </div>
              <span>${editDate(date)}</span>
            </div>
          </div>
    `;

    const likeSvg = li.querySelector("svg:nth-child(1)");
    const removeSvg = li.querySelector("svg:nth-child(2)");

    removeSvg.addEventListener("click", () => {
      const likesAmount = parseInt(commentsCouter.innerHTML) - 1;
      const commentsWord = likesAmount > 1 ? "comments" : "comment";
      commentsCouter.innerHTML = `${likesAmount} ${commentsWord}`;

      commentsList.removeChild(li);
    });
    likeSvg.addEventListener("click", () => {
      likeSvg.classList.toggle("like-active");
    });

    const likesAmount = parseInt(commentsCouter.innerHTML) + 1;
    const commentsWord = likesAmount > 1 ? "comments" : "comment";
    commentsCouter.innerHTML = `${likesAmount} ${commentsWord}`;

    commentsList.append(li);
  };

  const checkFields = () => {
    if (hasTriedComment) {
      if (usernameInput.value === "") {
        nameInputError.classList.add("active-error");
        nameInputError.innerHTML = possibleErrors.noValue;
      } else if (usernameInput.value.length < 2) {
        nameInputError.classList.add("active-error");
        nameInputError.innerHTML = possibleErrors.nameLength;
      } else {
        nameInputError.classList.remove("active-error");
        nameInputError.innerHTML = "";
      }

      if (textarea.value === "") {
        textareaError.classList.add("active-error");
        textareaError.innerHTML = possibleErrors.noValue;
      } else if (textarea.value.length > 160) {
        textareaError.classList.add("active-error");
        textareaError.innerHTML = possibleErrors.textAreaLength;
      } else {
        textareaError.classList.remove("active-error");
        textareaError.innerHTML = "";
      }
    }

    return (
      !!usernameInput.value &&
      !!textarea.value &&
      !(usernameInput.value.length < 2) &&
      !(textarea.value.length > 160)
    );
  };

  const editName = () => {
    let correctName = usernameInput.value.trim();
    correctName = correctName.charAt(0).toUpperCase() + correctName.slice(1);
    usernameInput.value = correctName;
  };
  
  const editText = () => {
    textarea.value = textarea.value.trim();
  };

  // Event listeners
  usernameInput.addEventListener("input", checkFields);
  textarea.addEventListener("input", checkFields);

  usernameInput.addEventListener("blur", () => editName());
  textarea.addEventListener("blur", () => editText());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hasTriedComment = true;
    if (checkFields() === false) {
      return undefined;
    }
    hasTriedComment = false;
    const userInputs = [usernameInput.value, textarea.value, datepicker.value];
    createListElement(...userInputs);
    usernameInput.value = "";
    textarea.value = "";
    datepicker.value = "";
  });

  form.addEventListener("keypress", (e) => {
    if (e.code === "Enter" && e.key !== "shift") {
      e.preventDefault();
      submitButton.click();
    }
  });
});

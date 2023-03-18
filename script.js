"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Temur Rekhviashvili",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Vladimer Vova Rekhviashvili",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovments = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = ``;
  movs.forEach(function (moves, index) {
    const date = new Date(acc.movementsDates[index]);
    const year = date.getFullYear();
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const displayDate = `${day}/${month}/${year}`;
    const type = moves > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${moves.toFixed(2)}€</div>
        </div>
     `;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};
console.log(account1);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acu, mov) {
    return acu + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  const year = new Date().getFullYear();
  const day = `${new Date().getDate()}`.padStart(2, 0);
  const month = `${new Date().getMonth() + 1}`.padStart(2, 0);
  const hour = new Date().getHours();
  const minutes = `${new Date().getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
};

const calcDisplaySummary = function (user) {
  const income = user.movements
    .filter((mov) => mov > 0)
    .reduce((acu, mov) => acu + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;
  const outcome = user.movements
    .filter((mov) => mov < 0)
    .reduce((acu, mov) => acu + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome).toFixed(2)}€`;
  const interest = user.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * user.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acu, int) => acu + int);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const CreateUserName = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(` `)
      .map((name) => name[0])
      .join(``);
  });
};

CreateUserName(accounts);
const updateUI = function (acc) {
  displayMovments(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
let currentUser;
btnLogin.addEventListener(`click`, (e) => {
  e.preventDefault();
  currentUser = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // display welcome message
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();
    // display movements , balanace, summary
    updateUI(currentUser);
  } else {
    // containerApp.style.opacity = 0;
    // labelWelcome.textContent = `Wrong password or username`;
  }
});
btnTransfer.addEventListener(`click`, (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (user) => user.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentUser.balance &&
    receiverAcc?.username !== currentUser.username
  ) {
    // doing transfer
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // adding dates to transfer
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // updateui
    updateUI(currentUser);
  }
  inputTransferAmount.value = inputTransferTo.value = ``;
});

btnLoan.addEventListener(`click`, (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentUser.movements.push(amount);
      currentUser.movementsDates.push(new Date().toISOString());
      updateUI(currentUser);
    }, 2500);
  }
  inputLoanAmount.value = ``;
});

btnClose.addEventListener(`click`, (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentUser.username
    );
    //deleting account
    accounts.splice(index, 1);
    //hiding ui
    containerApp.style.opacity = 0;
    // default welcome message
    labelWelcome.textContent = `Log in to get started`;
  }
  // clear input field
  inputCloseUsername.value = inputClosePin.value = ``;
});
let sorted = false; // state variable
btnSort.addEventListener(`click`, (e) => {
  e.preventDefault();
  sorted = !sorted;
  displayMovments(currentUser, !sorted);
});

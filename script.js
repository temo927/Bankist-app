"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Temur Rekhviashvili",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Nino Picxelauri",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Vladimer Vova Rekhviashvili",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Mariam Beridze",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovments = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = ``;
  movs.forEach(function (moves, index) {
    const type = moves > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${moves}€</div>
        </div>
     `;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acu, mov) {
    return acu + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (user) {
  const income = user.movements
    .filter((mov) => mov > 0)
    .reduce((acu, mov) => acu + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const outcome = user.movements
    .filter((mov) => mov < 0)
    .reduce((acu, mov) => acu + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  const interest = user.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * user.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acu, int) => acu + int);
  labelSumInterest.textContent = `${interest}€`;
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
  displayMovments(acc.movements);
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
  const amount = Number(inputTransferAmount.value);
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
    // updateui
    updateUI(currentUser);
  }
  inputTransferAmount.value = inputTransferTo.value = ``;
});

btnLoan.addEventListener(`click`, (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    updateUI(currentUser);
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
  displayMovments(currentUser.movements, !sorted);
});

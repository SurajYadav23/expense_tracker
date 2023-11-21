function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    amount: e.target.amount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  console.log(expenseDetails);
  const token = localStorage.getItem('token');
  axios
    .post('http://3.110.123.247:5000/api/v1/users/addexpense', expenseDetails, {
      headers: { Authorization: token },
    })
    .then((response) => {
      addNewExpensetoUI(response.data.expense);
    })
    .catch((err) => showError(err));
}

function showPremiumuserMessage() {
  document.getElementById('rzp-button1').style.visibility = 'hidden';
  document.getElementById('message').innerHTML = 'You are a premium user ';
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const ispremiumuser = decodeToken.ispremiumuser;
  if (ispremiumuser) {
    showPremiumuserMessage();
    showLeaderboard();
  }
  axios
    .get('http://3.110.123.247:5000/api/v1/expense/my', {
      headers: { Authorization: token },
    })
    .then((response) => {
      response.data.expenses.forEach((expense) => {
        addNewExpensetoUI(expense);
      });
    })
    .catch((err) => {
      showError(err);
    });
});

function addNewExpensetoUI(expense) {
  const parentElement = document.querySelector('#listOfExpenses tbody');
  const expenseElemId = `expense-${expense.id}`;

  const newRow = document.createElement('tr');
  newRow.id = expenseElemId;

  newRow.innerHTML = `
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.description}</td>
      <td>
          <button onclick='deleteExpense(event, ${expense.id})'>
              Delete Expense
          </button>
      </td>
  `;

  parentElement.appendChild(newRow);
}

function deleteExpense(e, expenseid) {
  const token = localStorage.getItem('token');
  axios
    .delete(`http://3.110.123.247:5000/api/v1/users/deleteexpense/${expenseid}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeExpensefromUI(expenseid);
    })
    .catch((err) => {
      showError(err);
    });
}

function showError(err) {
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`;
}
function showLeaderboard() {
  const inputElement = document.createElement('input');
  inputElement.type = 'button';
  inputElement.value = 'Show Leaderboard';
  inputElement.onclick = async () => {
    const token = localStorage.getItem('token');
    const userLeaderBoardArray = await axios.get(
      'http://3.110.123.247:5000/api/v1/premium/showLeaderBoard',
      { headers: { Authorization: token } }
    );
    console.log(userLeaderBoardArray);

    var leaderboardElem = document.getElementById('leaderboard');
    leaderboardElem.innerHTML += '<h1> Leader Board </<h1>';
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboardElem.innerHTML += `<li>Name - ${
        userDetails.username
      } Total Expense - ${userDetails.total_cost || 0} </li>`;
    });
  };
  document.getElementById('message').appendChild(inputElement);
}

function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

document.getElementById('rzp-button1').onclick = async function (e) {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    'http://3.110.123.247:5000/api/v1/purchase/premiummembership',
    { headers: { Authorization: token } }
  );
  console.log(response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const res = await axios.post(
        'http://3.110.123.247:5000/api/v1/purchase/updatetransactionstatus',
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert('You are a Premium User Now');
      document.getElementById('rzp-button1').style.visibility = 'hidden';
      document.getElementById('message').innerHTML = 'You are a premium user ';
      localStorage.setItem('token', res.data.token);
      console.log(localStorage.getItem('token'));
      showLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response) {
    console.log(response);
    alert('Something went wrong');
  });
};

function download() {
  axios
    .get('http://3.110.123.247:5000/api/v1/users/download', {
      headers: { Authorization: localStorage.getItem('token') },
    })
    .then((response) => {
      if (response.status === 201) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement('a');
        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      showError(err);
    });
}

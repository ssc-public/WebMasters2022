// let nameTextBox = document.getElementById("name");
// let myButton = document.getElementById("myButton");
// let resultArea = document.getElementById("result");

// myButton.onclick = function () {
//     let name = nameTextBox.value;
//     let welcomeMessage = "Welcome " + name;
//     resultArea.innerHTML = welcomeMessage;
// };

// let -> changable
// const -> not changable

// let y = "5adjsakdj";
// console.log(Number(y) + 7);
// // dynamically typed

// let myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// for (let item in myArray) {
//     console.log(item);
// }
// object in JS ~~ HashMap / Dictionary
// let myDetails = {
//     name: "Parsa",
//     surname: "Neshaei",
//     university: "Sharif"
// };

// let str = JSON.stringify(myDetails);

// let newObject = JSON.parse(str);
// console.log(newObject.surname);

// async function getValue() {
//     let response = await fetch("http://ce.sharif.com/has_user_signed_in");
//     let data = await response.json();
//     console.log(data);
// }

let roles = [
    {
        name: "Parsa",
        role: "Head AP"
    },
    {
        name: "Amirmahdi",
        role: "Project"
    },
    {
        name: "Parham",
        role: "Assignments"
    }
];

let startingWithP = roles.filter(function(item) {
    return item.name.startsWith("P");
});
// let names = startingWithP.map(function(item) {
//     return item.name
// });
let names = startingWithP.map(item => item.name);
console.log(names);

// let names = roles.map(function(item) {
//     return item.name;
// });
// console.log(names);



const headers = {
auth: 'blbla',
'set-cookie': 'daskldslk',
};

console.log(headers.auth); // dot notation
console.log(headers['set-cookie']); // bracket notation

const key = 'set-cookie';

console.log(headers.key) // undefined
console.log(headers[key]); // dynamical key // 'daskldslk'

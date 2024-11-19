// Utility to generate unique random numbers
function generateUniqueRandomNumbers(min, max, count) {
  if (count > max - min + 1) {
    throw new Error(
      "Cannot generate more unique random numbers than the range allows."
    );
  }
  const resultSet = new Set();
  while (resultSet.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    resultSet.add(randomNum);
  }
  return Array.from(resultSet);
}

// Generate keys: secret key (sk, sk_t), public key (pk, pk_t, A)
export function generateKeys() {
  const PRIME = 1523;

  const sk = generateUniqueRandomNumbers(10, 550, 256);
  const sk_t = generateUniqueRandomNumbers(1, 120, 25);
  const pk = generateUniqueRandomNumbers(1, 400, 256);
  const A = generateUniqueRandomNumbers(1, 550, 200);

  let pk_t = [];
  let res = 0;
  let temp = 0;
  let jj = 0;

  for (let i = 0; i < pk.length; i++) {
    if (i === sk_t[jj]) {
      jj++;
      continue;
    }
    res += pk[i] * sk[i];
  }

  pk_t.push(((res % PRIME) + (temp % PRIME)) % PRIME);
  res = 0;

  for (let i = 1; i < A.length; i++) {
    let xx = 0;
    for (let j = 0; j < pk.length; j++) {
      if (j === sk_t[xx]) {
        xx++;
        continue;
      }
      res += (pk[j] | A[i]) * sk[j];
    }
    pk_t.push(res % PRIME);
    res = 0;
  }

  const err = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
  pk_t = pk_t.map((value, i) => (value + err[i % 10]) % PRIME);

  return { SecretKey: { sk, sk_t }, PublicKey: { pk, pk_t, A } };
}

export function encryption(storedBits, A, pk, pk_t) {
  const n = storedBits.length;
  const encryptedText = [];
  const prime = 1523; // You need to define `prime`, or replace it with an appropriate prime number

  for (let i = 0; i < n; i++) {
    // Generate a random set of indices for the current bit
    const temp = [];
    for (let k = 0; k < 5; k++) {
      const x = 1 + Math.floor(Math.random() * 190); // Random number in [1, 190]
      temp.push(x);
    }

    const v = [];
    let sum = 0;

    // Calculate encrypted values using `A` and `pk`
    for (let ii = 0; ii < 256; ii++) {
      for (let jj = 0; jj < temp.length; jj++) {
        sum += A[temp[jj]] | pk[ii];
      }
      v.push(sum);
      sum = 0; // Reset sum for the next iteration
    }

    // Calculate the sum using `pk_t`
    for (let jj = 0; jj < temp.length; jj++) {
      sum += pk_t[temp[jj]];
    }

    sum = sum % prime;

    // Add the final encrypted value based on `storedBits[i]`
    if (storedBits[i] === 1) {
      v.push(((sum % prime) + Math.floor(prime / 2)) % prime);
    } else {
      v.push(sum % prime);
    }

    encryptedText.push(v);
  }

  return encryptedText;
}

export function ciphertext(s, A, pk, pk_t) {
  //   console.log(s);
  let vec = [];

  for (let index = 0; index < s.length; index++) {
    let storedBits = [];
    let c = s[index];
    let x = c.charCodeAt(0);
    let bits = Array(64).fill(0);

    let xx = x;
    let ii = 63;

    // Convert character to bits
    while (xx > 0) {
      if (xx & 1) {
        bits[ii] = 1;
      }
      xx = xx >> 1;
      ii--;
    }

    bits.reverse();

    // Find the start bit (the last '1' bit)
    let startBit = -1;
    for (let i = bits.length - 1; i >= 0; i--) {
      if (bits[i] !== 0) {
        startBit = i;
        break;
      }
    }

    // Store the bits starting from the last '1' bit
    for (let i = startBit; i >= 0; i--) {
      storedBits.push(bits[i]);
    }

    storedBits.reverse();

    // Assuming `encryption` is a predefined function
    let curr = encryption(storedBits, A, pk, pk_t);
    vec.push(curr);
  }

  return vec;
}

export function encryptFinal(message, pubKey) {
  const val = ciphertext(message, pubKey.A, pubKey.pk, pubKey.pk_t);
  return val;
}

export function decryption(cipherText, sk, sk_t) {
  const resultantBits = [];
  const prime = 1523; // Define `prime`, or replace it with the appropriate prime number

  // Process each ciphertext vector
  for (let i = 0; i < cipherText.length; i++) {
    let sum = 0;
    let xx = 0;

    // Sum based on secret key `sk` ignoring indices in `sk_t`
    for (let j = 0; j < 256; j++) {
      if (j === sk_t[xx]) {
        xx++;
        continue;
      }
      sum += cipherText[i][j] * sk[j];
    }

    // Extract the last element from the ciphertext vector
    let kk = cipherText[i][cipherText[i].length - 1];
    if (kk < 0) {
      kk = prime - (Math.abs(kk) % prime);
    }

    // Calculate the difference mod prime
    let diff = Math.abs((sum % prime) - (kk % prime)) % prime;
    sum = 0;

    // Determine the decrypted bit based on the difference
    if ((diff >= 0 && diff <= 380) || (diff >= 1142 && diff <= 1522)) {
      resultantBits.push(0);
    } else {
      resultantBits.push(1);
    }
  }

  // Construct the final result by shifting bits
  const finalResult = [];
  let xx = resultantBits[0];

  for (let i = 1; i < resultantBits.length; i++) {
    finalResult.push(xx);
    xx = resultantBits[i];
  }

  finalResult.push(xx);

  return finalResult;
}

export function finalmsg(cipher, sk, sk_t) {
  let finalMessage = "";

  for (let i = 0; i < cipher.length; i++) {
    // Decrypt the current ciphertext to get the plaintext bits
    const plainText = decryption(cipher[i], sk, sk_t);
    let ans = 0;

    // Convert the binary plaintext bits to an integer
    for (let ii = 0; ii < plainText.length; ii++) {
      if (plainText[ii] === 1) {
        ans += 1 << ii; // Equivalent to ans += 2^ii
      }
    }

    // Convert the integer to its character equivalent
    finalMessage += String.fromCharCode(ans);
  }

  return finalMessage;
}

export function finalDecrypt(cipher, pvt_key) {
  const val = finalmsg(cipher, pvt_key.sk, pvt_key.sk_t);
  return val;
}

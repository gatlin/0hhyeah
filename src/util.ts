export function bits2int(bitArray: Array<number>): number {
    let num: number = 0;
    const mask: number = 1;
    for (let i = 0; i < bitArray.length; i++) {
        const digit = bitArray[i];
        num = num << 1;
        if (digit) {
            num = num | mask;
        }
    }
    return num;
}

export function sum_bits(bitArray: Array<number>): number {
    return bitArray.reduce((total, n) => total + n, 0);
}

export function random_bit(): number {
    return Math.floor(Math.random() * 2);
}

// return the indices which are different for two arrays
export function array_diff(a: Array<any>, b: Array<any>): Array<number> {
    if (a.length !== b.length) {
        return [];
    }

    let result = [];
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            result.push(i);
        }
    }
    return result;
}

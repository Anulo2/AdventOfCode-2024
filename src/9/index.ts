type DiskBlock = number | '.';

function unpackDisk(data: number[]): DiskBlock[] {
    const unpackedDisk: DiskBlock[] = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = data[i]; j > 0; j--) {
            if (i % 2 === 0) {
                unpackedDisk.push(i / 2);
            } else {
                unpackedDisk.push('.');
            }
        }
    }
    return unpackedDisk;
}

function defragDisk(unpackedDisk: DiskBlock[]): DiskBlock[] {
    const defraggedDisk = [...unpackedDisk];
    defraggedDisk.forEach((block, index, arr) => {
        if (block === '.') {
            while (true) {
                const temp = arr.pop();
                if (temp === '.') {
                    continue;
                }
                    if (temp !== undefined) {
                        arr[index] = temp;
                    }
                    break;
            }
        }
    });
    return defraggedDisk;
}

function calculateChecksum(disk: (number | string)[]): number {
    return disk.reduce<number>((acc, block, id) => {
        if (typeof block === 'number') {
            return acc + block * id;
        }
        return acc;
    }, 0);
}

function unpackDiskPart2(data: number[]): (number | string)[][] {
    const unpackedDisk: (number | string)[][] = [];
    for (let i = 0; i < data.length; i++) {
        const file = [];
        for (let j = data[i]; j > 0; j--) {
            if (i % 2 === 0) {
                file.push(i / 2);
            } else {
                file.push('.');
            }
        }
        if (file.length) {
            unpackedDisk.push(file);
        }
    }
    return unpackedDisk;
}

function defragDiskPart2(unpackedDisk: (number | string)[][]): (number | string)[] {
    const movedIds: number[] = [];
    outer: for (let i = unpackedDisk.length - 1; i >= 0; i--) {
        if (unpackedDisk[i][0] !== '.' && !movedIds.includes(unpackedDisk[i][0] as number)) {
            for (let j = 0; j <= i; j++) {
                if (
                    unpackedDisk[j][0] === '.' &&
                    unpackedDisk[j].length >= unpackedDisk[i].length
                ) {
                    if (unpackedDisk[j].length === unpackedDisk[i].length) {
                        movedIds.push(unpackedDisk[i][0] as number);
                        const temp = [...unpackedDisk[j]];
                        unpackedDisk[j] = unpackedDisk[i];
                        unpackedDisk[i] = temp;
                        continue outer;
                    }
                        movedIds.push(unpackedDisk[i][0] as number);
                        const temp = [...unpackedDisk[i]];
                        unpackedDisk[i].fill('.');
                        unpackedDisk.splice(
                            j,
                            1,
                            temp,
                            unpackedDisk[j].slice(unpackedDisk[i].length)
                        );
                        i++;
                        continue outer;
                }
            }
        }
    }
    return unpackedDisk.flat();
}

export function part1(input: string): number {
    const data = input.trim().split("").map(Number);
    const unpackedDisk = unpackDisk(data);
    const defraggedDisk = defragDisk(unpackedDisk);
    return calculateChecksum(defraggedDisk);
}

export function part2(input: string): number {
    const data = input.trim().split("").map(Number);
    const unpackedDisk = unpackDiskPart2(data);
    const defraggedDisk = defragDiskPart2(unpackedDisk);
    return calculateChecksum(defraggedDisk as DiskBlock[]);
}
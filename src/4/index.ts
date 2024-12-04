function fillWithDiagonals(
    source: string[][],
    direction = "tl-br", // "tl-br" or "tr-bl"
): string[][] {
    const rows = source.length;
    const cols = source[0].length;
    const target: string[][] = Array.from({ length: rows + cols - 1 }, () => []); // Create target array for diagonals.

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = direction === "tl-br" ? row + col : row - col + (cols - 1);
            target[index].push(source[row][col]);
        }
    }

    return target;
}

function getMatches(lines: string[], patterns: string[]): string[] {
    return lines.reduce<string[]>((acc, line) => {
        const totalMatches = patterns.reduce((matches, pattern) => {
            const matchesInLine = line.match(new RegExp(pattern, "g")) || [];
            matches.push(...matchesInLine);
            return matches;
        }, [] as string[]);
        for (const match of totalMatches) {
            acc.push(match);
        }
        return acc;
    }, []);
}

function countMatches(lines: string[], patterns: string[]): number {
    return getMatches(lines, patterns).length;
}

export function part1(input: string): number {
    const patterns = ["XMAS", "SAMX"];
    const grid = input
        .trim()
        .split("\r\n")
        .map((line) => line.split(""));

    return [
        grid.map((row) => row.join("")), // Horizontal lines
        grid[0].map((_, col) => grid.map((row) => row[col]).join("")), // Vertical lines
        fillWithDiagonals(grid, "tl-br").map((diag) => diag.join("")), // Diagonal lines (tl-br)
        fillWithDiagonals(grid, "tr-bl").map((diag) => diag.join("")), // Diagonal lines (tr-bl)
    ]
        .flat()
        .map((line) => countMatches([line], patterns))
        .reduce((sum, count) => sum + count, 0);
}

export function part2(input: string): number {
    const patterns = ["MSMS", "SMSM", "MMSS", "SSMM"];
    const grid = input
        .trim()
        .split("\r\n")
        .map((line) => line.split(""));

    return grid.reduce(
        (sum, line, i) =>
            sum +
            line.reduce(
                (masCount, _, x) =>
                    masCount +
                    (grid[i][x] === "A" &&
                    grid[i - 1] &&
                    grid[i + 1] &&
                    patterns.includes(
                        `${grid[i - 1][x - 1]}${grid[i - 1][x + 1]}${grid[i + 1][x - 1]}${grid[i + 1][x + 1]}`,
                    )
                        ? 1
                        : 0),
                0,
            ),
        0,
    );
}
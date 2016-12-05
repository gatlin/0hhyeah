import { el } from './alm/alm';
import { bits2int, sum_bits, random_bit, array_diff } from './util';

export class Grid {
    public size: number;
    private data: Array<number>;

    constructor(size: number) {
        this.size = size;
        this.data = new Array<number>(size * size);
    }

    public at(x: number, y: number) {
        return this.data[y * this.size + x];
    }

    public set(x: number, y: number, v: number) {
        this.data[y * this.size + x] = v;
        return this;
    }

    public toggle(x: number, y: number) {
        return this.set(x, y, (this.at(x, y) + 1) % 3);
    }

    public initialize() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.set(i, j, 2);
            }
        }
        return this;
    }

    public verify() {
        if (!this.completed()) {
            return false;
        }

        const len = this.size; // it's a square, dummy!
        const rowsSeen = {};
        const colsSeen = {};

        const colSet = new Array(this.size);
        for (let i = 0; i < this.size; i++) {
            colSet[i] = new Array(this.size);
        }

        for (let j = 0; j < this.size; j++) {
            let row = [];
            for (let i = 0; i < this.size; i++) {
                const val = this.at(i, j);
                if (val === 2) {
                    return false;
                }

                if (!this.check_horizontal_double((j * this.size + i), val) ||
                    !this.check_vertical_double((j * this.size + i), val)) {
                    return false;
                }
                row.push(val);
                // build up the columns as well
                colSet[i][j] = val;
            }
            const rowNum = bits2int(row);
            if (rowNum in rowsSeen) {
                return false;
            } else {
                rowsSeen[rowNum] = 1;
            }
            if (sum_bits(row) !== (len / 2)) {
                return false;
            }
        }

        // now study the columns
        for (let c = 0; c < this.size; c++) {
            const col = colSet[c];
            const colNum = bits2int(col);
            if (colNum in colsSeen) {
                return false;
            } else {
                colsSeen[colNum] = 1;
            }
            if (sum_bits(col) !== (len / 2)) {
                return false;
            }
        }
        return true;
    }

    private completed(): boolean {
        return this.data.reduce((res, v) => res && (v !== 2), true);
    }

    private left_bounded_cell(idx: number): boolean {
        return (idx % this.size) === 0;
    }

    private right_bounded_cell(idx: number): boolean {
        return (idx % this.size) === (this.size - 1);
    }

    private top_bounded_cell(idx: number): boolean {
        return idx < this.size;
    }

    private bottom_bounded_cell(idx: number): boolean {
        return idx > (this.size * (this.size - 1));
    }

    public check_horizontal_double(idx: number, color: number): boolean {
        const left_neighbor_same = this.left_bounded_cell(idx)
            ? false
            : color === this.data[idx - 1];
        const right_neighbor_same = this.right_bounded_cell(idx)
            ? false
            : color === this.data[idx + 1];
        return (!left_neighbor_same && !right_neighbor_same);
    }

    public check_vertical_double(idx: number, color: number): boolean {
        const top_neighbor_same = this.top_bounded_cell(idx)
            ? false
            : color === this.data[idx - (this.size)];
        const bot_neighbor_same = this.bottom_bounded_cell(idx)
            ? false
            : color === this.data[idx + (this.size)];
        return (!top_neighbor_same && !bot_neighbor_same);
    }

    public solve_pass() {
        const size = this.size;
        const s1 = this.size; // for brevity
        const s2 = this.size * 2;

        // go through and fill in any gaps or doubles
        for (let idx = 0; idx < (size * size); idx++) {
            if (this.data[idx] === 2) {
                continue;
            }

            // look for horizontal doubles
            if (!this.right_bounded_cell(idx) &&
                this.data[idx] === this.data[idx + 1] &&
                (this.right_bounded_cell(idx + 1) ||
                    this.data[idx + 2] !== this.data[idx]) &&
                (this.left_bounded_cell(idx) ||
                    this.data[idx - 1] !== this.data[idx])) {

                if (!this.left_bounded_cell(idx) &&
                    this.data[idx - 1] === 2) {
                    this.data[idx - 1] = (this.data[idx] + 1) % 2;
                }

                if (!this.right_bounded_cell(idx + 1) &&
                    this.data[idx + 2] === 2) {
                    this.data[idx + 2] = (this.data[idx] + 1) % 2;
                }
            }

            // look for vertical doubles
            if (!this.bottom_bounded_cell(idx) &&
                this.data[idx] === this.data[idx + s1] &&
                (this.bottom_bounded_cell(idx + s1) ||
                    this.data[idx + s2] !== this.data[idx]) &&
                (this.top_bounded_cell(idx) ||
                    this.data[idx - s1] !== this.data[idx])) {

                if (!this.top_bounded_cell(idx) &&
                    this.data[idx - s1] === 2) {
                    this.data[idx - s1] =
                        (this.data[idx] + 1) % 2;
                }

                if (!this.bottom_bounded_cell(idx + s1) &&
                    this.data[idx + s2] === 2) {
                    this.data[idx + s2] = (this.data[idx] + 1) % 2;
                }
            }

            // look for horizontal gaps
            if (!this.right_bounded_cell(idx) &&
                !this.right_bounded_cell(idx + 1) &&
                this.data[idx] === this.data[idx + 2] &&
                this.data[idx + 1] === 2) {
                this.data[idx + 1] = (this.data[idx] + 1) % 2;
            }

            // look for vertical gaps
            if (!this.bottom_bounded_cell(idx) &&
                !this.bottom_bounded_cell(idx + s1) &&
                this.data[idx] === this.data[idx + s2] &&
                this.data[idx + s1] === 2) {
                this.data[idx + s1] = (this.data[idx] + 1) % 2;
            }
        }

        const completedRows = [];
        const missing2Rows = [];

        // check to see if any rows are almost done
        for (let j = 0; j < size; j++) {
            const totals = [0, 0];
            let remaining = 0;
            const row = new Array(size);
            for (let i = 0; i < size; i++) {
                const val = this.at(i, j);
                if (val !== 2) {
                    totals[val] = totals[val] + 1;
                }
                else {
                    remaining++;
                }
                row[i] = val;
            }
            if (remaining === 0) {
                completedRows.push({
                    idx: j,
                    row: row
                });
            }

            if (remaining === 2) {
                missing2Rows.push({
                    idx: j,
                    row: row
                });
            }
            let color_fill;
            if (totals[0] === size / 2) {
                color_fill = 1;
            } else if (totals[1] === size / 2) {
                color_fill = 0;
            } else {
                continue;
            }

            for (let i = 0; i < size; i++) {
                if (this.at(i, j) === 2) {
                    this.set(i, j, color_fill);
                }
            }
        }

        const completedCols = [];
        const missing2Cols = [];

        // check to see if any columns are almost done
        for (let i = 0; i < size; i++) {
            const totals = [0, 0];
            let remaining = 0;
            const col = new Array(size);
            for (let j = 0; j < size; j++) {
                const val = this.at(i, j);
                col[j] = val;
                if (val !== 2) {
                    totals[val] = totals[val] + 1;
                }
                else {
                    remaining++;
                }
            }

            if (remaining === 0) {
                completedCols.push({
                    idx: i,
                    col: col
                });
            }

            if (remaining === 2) {
                missing2Cols.push({
                    idx: i,
                    col: col
                });
            }

            let color_fill;
            if (totals[0] === size / 2) {
                color_fill = 1;
            } else if (totals[1] === size / 2) {
                color_fill = 0;
            } else {
                continue;
            }

            for (let j = 0; j < size; j++) {
                if (this.at(i, j) === 2) {
                    this.set(i, j, color_fill);
                }
            }
        }

        // go over the rows missing 2, compare them to completed rows, and then
        // finish them
        for (let urow of missing2Rows) {
            for (let frow of completedRows) {
                const row_diff = array_diff(urow.row, frow.row);
                if (row_diff.length === 2) {
                    this.set(row_diff[0],
                        urow.idx,
                        frow.row[row_diff[1]]);
                    this.set(row_diff[1],
                        urow.idx,
                        frow.row[row_diff[0]]);
                }
            }
        }

        // and the same for columns
        for (let ucol of missing2Cols) {
            for (let fcol of completedCols) {
                const col_diff = array_diff(ucol.col, fcol.col);
                if (col_diff.length === 2) {
                    this.set(ucol.idx,
                        col_diff[0],
                        fcol.col[col_diff[1]]);
                    this.set(ucol.idx,
                        col_diff[1],
                        fcol.col[col_diff[0]]);
                }
            }
        }
    }

    // given a cell checks to see if it violates any rules
    public solve() {
        let limit = 0;
        while (limit++ < 200 && !this.completed()) {
            this.solve_pass();
        }
    }

    private randomUnder(n: number): number {
        return Math.floor(Math.random() * n);
    }

    private clear() {
        for (let idx in this.data) {
            this.data[idx] = 2;
        }
    }

    public generate() {
        this.clear();
        // generate random tiles
        let attempts = 0;
        while (attempts++ < (this.size * this.size * 50)) {
            let emptyCells = false;
            this.data = this.data.map((currentColor, idx) => {
                if (currentColor !== 2) {
                    return currentColor;
                }
                emptyCells = true;
                const color_prob = this.randomUnder(10);
                if (color_prob < 3) {
                    let color = this.randomUnder(2);
                    if (!this.check_vertical_double(idx, color) ||
                        !this.check_horizontal_double(idx, color)) {
                        color = (color + 1) % 2;
                        if (!this.check_vertical_double(idx, color) ||
                            !this.check_horizontal_double(idx, color)) {
                            color = 2;
                        }
                    }
                    return color;
                } else {
                    return 2;
                }
            });
            this.solve();
            if (!emptyCells) {
                break;
            }
        }
        return this;
    }

    public render() {
        const tblRows = new Array(this.size);
        let count = 0;
        for (let j = 0; j < this.size; j++) {
            const tblRow = [];
            for (let i = 0; i < this.size; i++) {
                //const val = (i + j) % 2;
                const val = this.at(i, j);
                const td = el('td', {
                    'class': 'grid-cell-td',
                    'id': 'grid-cell-td-' + count.toString()
                }, [el('span', {
                    'class': 'grid-cell grid-cell-' + val.toString(),
                    'id': 'grid-cell-' + i.toString() + ':' + j.toString()
                }, [''])]);

                tblRow.push(td);
                count++;
            }
            tblRows[j] = el('tr', {
                'class': 'grid-row',
                'id': 'grid-row-' + j.toString()
            }, tblRow);
        }

        const gridTable = el('table', {
            'class': 'grid-table'
        }, tblRows);

        return el('div', {}, [
            gridTable,
            el('div', {
                'id': 'grid-status'
            }, [(this.verify() ? 'Correct' : 'Incorrect')]),
            el('button', {
                'id': 'solve-btn'
            }, ['Solve']),
            el('button', {
                'id': 'generate-btn'
            }, ['Generate'])
        ]);
    }
}
